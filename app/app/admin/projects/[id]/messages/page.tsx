"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import MessageComposer from "@/components/messages/MessageComposer";
import MessageThread from "@/components/messages/MessageThread";
import {
  getProjectMessages,
  Message,
} from "@/lib/core/messageStore";
import { getProjectById } from "@/lib/core/projectStore";
import { getUsers } from "@/lib/core/authStore";

export default function ProjectMessagesPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [projectName, setProjectName] = useState("Project");
  const [user, setUser] = useState<any>(null);

  function load() {
    const project = getProjectById(projectId);

    setProjectName(project?.name || "Project");
    setMessages(getProjectMessages(projectId));

    const users = getUsers();
    setUser(
      users.find((item: any) => item.role === "Owner" && item.active) ||
        users.find((item: any) => item.active) ||
        null
    );
  }

  useEffect(() => {
    load();

    const interval = setInterval(load, 1000);

    return () => clearInterval(interval);
  }, [projectId]);

  const currentUser = user || {
    id: "USR-001",
    name: "Mason & Arc Owner",
    role: "Owner",
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Project Communication
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            {projectName}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Project messages, mentions and attachments.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <MessageThread
            messages={messages}
            currentUserId={currentUser.id}
          />

          <MessageComposer
            scope="Project"
            projectId={projectId}
            projectName={projectName}
            senderId={currentUser.id}
            senderName={currentUser.name}
            senderRole={currentUser.role}
            onSent={load}
          />
        </div>
      </div>
    </main>
  );
}
