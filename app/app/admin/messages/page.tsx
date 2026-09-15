"use client";

import { useEffect, useState } from "react";
import MessageComposer from "@/components/messages/MessageComposer";
import MessageThread from "@/components/messages/MessageThread";
import {
  getInternalMessages,
  Message,
} from "@/lib/core/messageStore";
import { getUsers } from "@/lib/core/authStore";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);

  function load() {
    setMessages(getInternalMessages());

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
  }, []);

  const currentUser = user || {
    id: "USR-001",
    name: "Mason & Arc Owner",
    role: "Owner",
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Communication
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Messages
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Internal team communication and project conversations.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <MessageThread
            messages={messages}
            currentUserId={currentUser.id}
          />

          <MessageComposer
            scope="Internal"
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
