"use client";

import {
  addActivity,
  type ActivityType,
} from "@/lib/core/activityStore";
import { addNotification } from "@/lib/core/notificationStore";

export type TaskStatus = "Open" | "In Progress" | "Completed" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export type TaskComment = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type TaskHistoryEntry = {
  id: string;
  action: string;
  from?: string;
  to?: string;
  by: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  project: string;
  projectId?: string;
  assignee: string;
  assigneeId: string;
  department: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  description: string;
  createdAt: string;
  parentTaskId?: string;
  dependencies?: string[];
  subtasks?: string[];
  comments?: TaskComment[];
  history?: TaskHistoryEntry[];
  linkedFileIds?: string[];
  linkedApprovalIds?: string[];
  linkedSiteIssueIds?: string[];
};

const STORAGE_KEY = "mason-arc-tasks";

const initialTasks: Task[] = [
  {
    id: "TSK-001",
    title: "Revise Ground Floor Plan",
    project: "City Edge Mall",
    projectId: "CEM-001",
    assignee: "Omar Mohamed",
    assigneeId: "OM-001",
    department: "Architecture",
    priority: "High",
    deadline: "Today",
    status: "In Progress",
    description: "Coordinate the latest ground floor plan revisions.",
    createdAt: new Date().toISOString(),
    dependencies: [],
    subtasks: [],
    comments: [],
    history: [],
  },
];

function load(): Task[] {
  if (typeof window === "undefined") return initialTasks;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
      return initialTasks;
    }

    const parsed = JSON.parse(raw) as Task[];

    return parsed.map((task) => ({
      ...task,
      dependencies: task.dependencies || [],
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      history: task.history || [],
      linkedFileIds: task.linkedFileIds || [],
      linkedApprovalIds: task.linkedApprovalIds || [],
      linkedSiteIssueIds: task.linkedSiteIssueIds || [],
    }));
  } catch {
    return initialTasks;
  }
}

function save(tasks: Task[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

function nextId(tasks: Task[]) {
  const max = tasks.reduce((value, task) => {
    const number = Number(task.id.replace(/\D/g, ""));

    return Number.isFinite(number)
      ? Math.max(value, number)
      : value;
  }, 0);

  return `TSK-${String(max + 1).padStart(3, "0")}`;
}

function nextChildId(parentId: string, tasks: Task[]) {
  const count =
    tasks.filter((task) => task.parentTaskId === parentId).length + 1;

  return `${parentId}-ST-${String(count).padStart(2, "0")}`;
}

function logHistory(
  task: Task,
  action: string,
  by: string,
  from?: string,
  to?: string
): TaskHistoryEntry {
  return {
    id: `${task.id}-H-${Date.now()}`,
    action,
    from,
    to,
    by,
    createdAt: new Date().toISOString(),
  };
}

export function getTasks() {
  return load();
}

export function getTaskById(id: string) {
  return getTasks().find((task) => task.id === id);
}

export function getSubtasks(parentTaskId: string) {
  return getTasks().filter(
    (task) => task.parentTaskId === parentTaskId
  );
}

export function getParentTask(taskId: string) {
  const task = getTaskById(taskId);

  return task?.parentTaskId
    ? getTaskById(task.parentTaskId)
    : undefined;
}

export function getTaskComments(taskId: string) {
  return getTaskById(taskId)?.comments || [];
}

export function getTaskHistory(taskId: string) {
  return getTaskById(taskId)?.history || [];
}

export function getTaskDependencies(taskId: string) {
  const task = getTaskById(taskId);

  if (!task) return [];

  return (task.dependencies || [])
    .map((id) => getTaskById(id))
    .filter((item): item is Task => Boolean(item));
}

export function canStartTask(taskId: string) {
  const dependencies = getTaskDependencies(taskId);

  return dependencies.every(
    (task) => task.status === "Completed"
  );
}

export function addTask(
  input: Omit<
    Task,
    "id" | "createdAt" | "comments" | "history" | "subtasks"
  >
) {
  const tasks = getTasks();

  const task: Task = {
    ...input,
    id: nextId(tasks),
    createdAt: new Date().toISOString(),
    dependencies: input.dependencies || [],
    subtasks: [],
    comments: [],
    history: [],
    linkedFileIds: [],
    linkedApprovalIds: [],
    linkedSiteIssueIds: [],
  };

  task.history = [
    logHistory(
      task,
      "Task Created",
      task.assignee || "Mason & Arc"
    ),
  ];

  tasks.push(task);

  save(tasks);

  addActivity({
    type: "Task Created" as ActivityType,
    title: task.title,
    description: `${task.assignee} was assigned a new task.`,
    projectId: task.projectId,
    projectName: task.project,
    userName: task.assignee,
    metadata: {
      taskId: task.id,
      priority: task.priority,
    },
  });

  addNotification({
    type: "task",
    title: "New Task Assigned",
    message: `${task.title} assigned to ${task.assignee}.`,
    
  });

  return task;
}

export function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>
) {
  const tasks = getTasks();

  const index = tasks.findIndex(
    (task) => task.id === id
  );

  if (index === -1) return undefined;

  const current = tasks[index];

  const next = {
    ...current,
    ...updates,
  };

  const history = [
    ...(current.history || []),
  ];

  if (
    updates.status &&
    updates.status !== current.status
  ) {
    history.push(
      logHistory(
        current,
        "Status Changed",
        updates.assignee || current.assignee,
        current.status,
        updates.status
      )
    );
  }

  if (
    updates.assigneeId &&
    updates.assigneeId !== current.assigneeId
  ) {
    history.push(
      logHistory(
        current,
        "Assignment Changed",
        updates.assignee || current.assignee,
        current.assignee,
        updates.assignee
      )
    );
  }

  tasks[index] = {
    ...next,
    dependencies: next.dependencies || [],
    subtasks: next.subtasks || [],
    comments: next.comments || [],
    history,
  };

  save(tasks);

  addActivity({
    type: "Task Updated" as ActivityType,
    title: current.title,
    description: `${current.title} was updated.`,
    projectId: current.projectId,
    projectName: current.project,
    userName: updates.assignee || current.assignee,
    metadata: {
      taskId: current.id,
      status: tasks[index].status,
    },
  });

  return tasks[index];
}

export function addTaskComment(
  taskId: string,
  input: Omit<TaskComment, "id" | "createdAt">
) {
  const tasks = getTasks();

  const index = tasks.findIndex(
    (task) => task.id === taskId
  );

  if (index === -1) return undefined;

  const comment: TaskComment = {
    ...input,
    id: `${taskId}-C-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  tasks[index].comments = [
    ...(tasks[index].comments || []),
    comment,
  ];

  tasks[index].history = [
    ...(tasks[index].history || []),
    logHistory(
      tasks[index],
      "Comment Added",
      input.authorName
    ),
  ];

  save(tasks);

  addActivity({
    type: "Task Updated" as ActivityType,
    title: `Comment added to ${tasks[index].title}`,
    description: input.body,
    projectId: tasks[index].projectId,
    projectName: tasks[index].project,
    userName: input.authorName,
    metadata: {
      taskId,
      commentId: comment.id,
    },
  });

  return comment;
}

export function addSubtask(
  parentTaskId: string,
  input: Omit<
    Task,
    "id" |
    "createdAt" |
    "parentTaskId" |
    "comments" |
    "history" |
    "subtasks"
  >
) {
  const tasks = getTasks();

  const parent = tasks.find(
    (task) => task.id === parentTaskId
  );

  if (!parent) return undefined;

  const child: Task = {
    ...input,
    id: nextChildId(parentTaskId, tasks),
    parentTaskId,
    createdAt: new Date().toISOString(),
    dependencies: input.dependencies || [],
    subtasks: [],
    comments: [],
    history: [],
    linkedFileIds: [],
    linkedApprovalIds: [],
    linkedSiteIssueIds: [],
  };

  child.history = [
    logHistory(
      child,
      "Subtask Created",
      child.assignee || "Mason & Arc"
    ),
  ];

  tasks.push(child);

  parent.subtasks = [
    ...(parent.subtasks || []),
    child.id,
  ];

  save(tasks);

  return child;
}

export function addTaskDependency(
  taskId: string,
  dependencyId: string
) {
  if (taskId === dependencyId) return false;

  const tasks = getTasks();

  const task = tasks.find(
    (item) => item.id === taskId
  );

  const dependency = tasks.find(
    (item) => item.id === dependencyId
  );

  if (!task || !dependency) return false;

  const dependencies = new Set(
    task.dependencies || []
  );

  if (dependencies.has(dependencyId)) {
    return true;
  }

  dependencies.add(dependencyId);

  task.dependencies = Array.from(dependencies);

  task.history = [
    ...(task.history || []),
    logHistory(
      task,
      "Dependency Added",
      task.assignee || "Mason & Arc",
      undefined,
      dependencyId
    ),
  ];

  save(tasks);

  return true;
}

export function removeTaskDependency(
  taskId: string,
  dependencyId: string
) {
  const tasks = getTasks();

  const task = tasks.find(
    (item) => item.id === taskId
  );

  if (!task) return false;

  task.dependencies = (
    task.dependencies || []
  ).filter(
    (id) => id !== dependencyId
  );

  save(tasks);

  return true;
}

export function deleteTask(id: string) {
  const tasks = getTasks();

  const task = tasks.find(
    (item) => item.id === id
  );

  if (!task) return false;

  // Deleting a parent task also deletes its subtasks so no orphaned work items
  // remain hidden in the command center.
  const deletedIds = new Set<string>([id]);
  let foundChildren = true;
  while (foundChildren) {
    foundChildren = false;
    for (const item of tasks) {
      if (item.parentTaskId && deletedIds.has(item.parentTaskId) && !deletedIds.has(item.id)) {
        deletedIds.add(item.id);
        foundChildren = true;
      }
    }
  }

  const remaining = tasks
    .filter((item) => !deletedIds.has(item.id))
    .map((item) => ({
      ...item,
      dependencies: (
        item.dependencies || []
      ).filter(
        (dependencyId) => !deletedIds.has(dependencyId)
      ),
      subtasks: (
        item.subtasks || []
      ).filter(
        (subtaskId) => !deletedIds.has(subtaskId)
      ),
    }));

  save(remaining);

  addActivity({
    type: "Task Deleted" as ActivityType,
    title: task.title,
    description: `${task.title} was deleted.`,
    projectId: task.projectId,
    projectName: task.project,
    userName: task.assignee,
    metadata: {
      taskId: task.id,
    },
  });

  return true;
}


function updateLinkedRecord(
  taskId: string,
  field: "linkedFileIds" | "linkedApprovalIds" | "linkedSiteIssueIds",
  recordId: string,
  add: boolean
) {
  const tasks = getTasks();
  const task = tasks.find((item) => item.id === taskId);
  if (!task || !recordId.trim()) return false;

  const current = new Set(task[field] || []);
  if (add) current.add(recordId.trim());
  else current.delete(recordId.trim());

  task[field] = Array.from(current);
  task.history = [
    ...(task.history || []),
    logHistory(
      task,
      add ? "Linked Record Added" : "Linked Record Removed",
      task.assignee || "Mason & Arc",
      undefined,
      recordId.trim()
    ),
  ];

  save(tasks);
  return true;
}

export function linkTaskToFile(taskId: string, fileId: string) {
  return updateLinkedRecord(taskId, "linkedFileIds", fileId, true);
}

export function unlinkTaskFromFile(taskId: string, fileId: string) {
  return updateLinkedRecord(taskId, "linkedFileIds", fileId, false);
}

export function linkTaskToApproval(taskId: string, approvalId: string) {
  return updateLinkedRecord(taskId, "linkedApprovalIds", approvalId, true);
}

export function unlinkTaskFromApproval(taskId: string, approvalId: string) {
  return updateLinkedRecord(taskId, "linkedApprovalIds", approvalId, false);
}

export function linkTaskToSiteIssue(taskId: string, issueId: string) {
  return updateLinkedRecord(taskId, "linkedSiteIssueIds", issueId, true);
}

export function unlinkTaskFromSiteIssue(taskId: string, issueId: string) {
  return updateLinkedRecord(taskId, "linkedSiteIssueIds", issueId, false);
}

export function getOverdueTasks() {
  return getTasks().filter(
    (task) => task.status === "Overdue"
  );
}

export function getOpenTasks() {
  return getTasks().filter(
    (task) =>
      task.status === "Open" ||
      task.status === "In Progress"
  );
}

export function getCompletedTasks() {
  return getTasks().filter(
    (task) => task.status === "Completed"
  );
}

export function resetTasks() {
  save(initialTasks);
}
