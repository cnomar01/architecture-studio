"use client";

import { addActivity } from "@/lib/core/activityStore";
import { matchesProject, resolveProjectId } from "@/lib/core/projectRelation";

export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Changes Requested";

export type ApprovalType =
  | "Drawing"
  | "Material"
  | "Render"
  | "Document";

export type Approval = {
  id: string;
  project: string;
  projectId?: string;
  title: string;
  type: ApprovalType;
  revision: string;
  submittedBy: string;
  submittedById: string;
  submittedDate: string;
  description: string;
  status: ApprovalStatus;
  reviewer: string;
  reviewComment: string;
  reviewedDate: string;
  fileId?: string;
  fileName?: string;
};

const STORAGE_KEY =
  "mason-arc-approvals";


/* =========================================
   GET APPROVALS
========================================= */

export function getApprovals(): Approval[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  const stored =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(
      stored
    ) as Approval[];
  } catch {
    localStorage.removeItem(
      STORAGE_KEY
    );

    return [];
  }
}


/* =========================================
   SAVE APPROVALS
========================================= */

export function saveApprovals(
  approvals: Approval[]
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(approvals)
  );
}


/* =========================================
   ADD APPROVAL
========================================= */

export function addApproval(
  approval: Omit<
    Approval,
    | "id"
    | "status"
    | "reviewer"
    | "reviewComment"
    | "reviewedDate"
  >
) {
  const approvals =
    getApprovals();

  const newApproval: Approval = {
    ...approval,
    projectId: approval.projectId ?? resolveProjectId(approval.project),

    id: createApprovalId(
      approvals
    ),

    status: "Pending",

    reviewer: "",

    reviewComment: "",

    reviewedDate: "",
  };


  saveApprovals([
    ...approvals,
    newApproval,
  ]);


  /* =====================================
     ACTIVITY — APPROVAL CREATED
  ===================================== */

  addActivity({
    type: "Approval",

    title: "Approval Submitted",

    description:
      `${newApproval.title} ${newApproval.revision} was submitted for approval on ${newApproval.project}.`,

    projectId:
      newApproval.projectId,

    projectName:
      newApproval.project,

    userId:
      newApproval.submittedById,

    userName:
      newApproval.submittedBy,

    metadata: {
      Approval:
        newApproval.id,

      Type:
        newApproval.type,

      Revision:
        newApproval.revision,

      Status:
        newApproval.status,

      ...(newApproval.fileName
        ? {
            File:
              newApproval.fileName,
          }
        : {}),
    },
  });


  return newApproval;
}


/* =========================================
   UPDATE APPROVAL
========================================= */

export function updateApproval(
  approvalId: string,
  updates: Partial<Approval>
) {
  const approvals =
    getApprovals();

  const oldApproval =
    approvals.find(
      (approval) =>
        approval.id === approvalId
    );


  if (!oldApproval) {
    return approvals;
  }


  const updated =
    approvals.map(
      (approval) =>
        approval.id === approvalId
          ? {
              ...approval,
              ...updates,
            }
          : approval
    );


  const updatedApproval =
    updated.find(
      (approval) =>
        approval.id === approvalId
    );


  saveApprovals(updated);


  if (!updatedApproval) {
    return updated;
  }


  /* =====================================
     STATUS CHANGE
  ===================================== */

  if (
    updates.status &&
    updates.status !==
      oldApproval.status
  ) {

    let title =
      "Approval Status Updated";

    if (
      updates.status ===
      "Approved"
    ) {
      title =
        "Approval Approved";
    }

    if (
      updates.status ===
      "Changes Requested"
    ) {
      title =
        "Changes Requested";
    }


    addActivity({
      type: "Approval",

      title,

      description:
        `${updatedApproval.title} ${updatedApproval.revision} changed from ${oldApproval.status} to ${updatedApproval.status}.`,

      projectId:
        updatedApproval.projectId,

      projectName:
        updatedApproval.project,

      userName:
        updatedApproval.reviewer ||
        "Mason & Arc",

      metadata: {
        Approval:
          updatedApproval.id,

        Type:
          updatedApproval.type,

        Revision:
          updatedApproval.revision,

        From:
          oldApproval.status,

        To:
          updatedApproval.status,

        ...(updatedApproval.reviewComment
          ? {
              Comment:
                updatedApproval.reviewComment,
            }
          : {}),
      },
    });
  }


  /* =====================================
     REVIEWER CHANGE
  ===================================== */

  if (
    updates.reviewer !==
      undefined &&
    updates.reviewer !==
      oldApproval.reviewer
  ) {

    addActivity({
      type: "Approval",

      title:
        "Approval Reviewer Updated",

      description:
        `${updatedApproval.title} is now assigned to ${updatedApproval.reviewer || "No Reviewer"}.`,

      projectId:
        updatedApproval.projectId,

      projectName:
        updatedApproval.project,

      metadata: {
        Approval:
          updatedApproval.id,

        Reviewer:
          updatedApproval.reviewer ||
          "No Reviewer",
      },
    });
  }


  /* =====================================
     REVIEW COMMENT
  ===================================== */

  if (
    updates.reviewComment !==
      undefined &&
    updates.reviewComment !==
      oldApproval.reviewComment &&
    updates.reviewComment.trim()
  ) {

    addActivity({
      type: "Approval",

      title:
        "Approval Review Comment Added",

      description:
        `${updatedApproval.title} received a review comment.`,

      projectId:
        updatedApproval.projectId,

      projectName:
        updatedApproval.project,

      userName:
        updatedApproval.reviewer ||
        "Reviewer",

      metadata: {
        Approval:
          updatedApproval.id,

        Comment:
          updatedApproval.reviewComment,
      },
    });
  }


  /* =====================================
     REVISION CHANGE
  ===================================== */

  if (
    updates.revision &&
    updates.revision !==
      oldApproval.revision
  ) {

    addActivity({
      type: "Approval",

      title:
        "Approval Revision Updated",

      description:
        `${updatedApproval.title} changed from ${oldApproval.revision} to ${updatedApproval.revision}.`,

      projectId:
        updatedApproval.projectId,

      projectName:
        updatedApproval.project,

      metadata: {
        Approval:
          updatedApproval.id,

        From:
          oldApproval.revision,

        To:
          updatedApproval.revision,
      },
    });
  }


  return updated;
}


/* =========================================
   DELETE APPROVAL
========================================= */

export function deleteApproval(
  approvalId: string
) {
  const approvals =
    getApprovals();

  const approval =
    approvals.find(
      (item) =>
        item.id === approvalId
    );


  const updated =
    approvals.filter(
      (item) =>
        item.id !== approvalId
    );


  saveApprovals(updated);


  if (approval) {

    addActivity({
      type: "Approval",

      title:
        "Approval Deleted",

      description:
        `${approval.title} ${approval.revision} approval request was deleted.`,

      projectId:
        approval.projectId,

      projectName:
        approval.project,

      userId:
        approval.submittedById,

      userName:
        approval.submittedBy,

      metadata: {
        Approval:
          approval.id,

        Type:
          approval.type,

        Revision:
          approval.revision,

        Status:
          approval.status,
      },
    });
  }


  return updated;
}


/* =========================================
   GET BY ID
========================================= */

export function getApprovalById(
  approvalId: string
) {
  return (
    getApprovals().find(
      (approval) =>
        approval.id ===
        approvalId
    ) ?? null
  );
}


/* =========================================
   GET BY FILE ID
========================================= */

export function getApprovalByFileId(
  fileId: string
) {
  return (
    getApprovals().find(
      (approval) =>
        approval.fileId === fileId
    ) ?? null
  );
}


/* =========================================
   GET PROJECT APPROVALS
========================================= */

export function getProjectApprovals(project: string) {
  return getApprovals().filter((approval) => matchesProject(approval, project));
}


/* =========================================
   GET PENDING APPROVALS
========================================= */

export function getPendingApprovals() {
  return getApprovals().filter(
    (approval) =>
      approval.status ===
      "Pending"
  );
}


/* =========================================
   GET APPROVED APPROVALS
========================================= */

export function getApprovedApprovals() {
  return getApprovals().filter(
    (approval) =>
      approval.status ===
      "Approved"
  );
}


/* =========================================
   APPROVAL ID GENERATOR
========================================= */

function createApprovalId(
  approvals: Approval[]
) {
  const usedNumbers =
    approvals
      .map((approval) => {
        const match =
          approval.id.match(
            /APR-(\d+)/
          );

        return match
          ? Number(match[1])
          : 0;
      })
      .filter(
        (number) =>
          number > 0
      );


  const nextNumber =
    usedNumbers.length > 0
      ? Math.max(
          ...usedNumbers
        ) + 1
      : 1;


  return `APR-${String(
    nextNumber
  ).padStart(3, "0")}`;
}