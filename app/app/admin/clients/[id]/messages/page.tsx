"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import MessageComposer from "@/components/messages/MessageComposer";
import MessageThread from "@/components/messages/MessageThread";
import {
  getClientMessages,
  Message,
} from "@/lib/core/messageStore";
import { getUsers } from "@/lib/core/authStore";

export default function ClientMessagesPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);

  function load() {
    setMessages(getClientMessages());

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
  }, [clientId]);

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
            Client Communication
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Client Messages
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Client ↔ Mason & Arc communication with attachments.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <MessageThread
            messages={messages}
            currentUserId={currentUser.id}
          />

          <MessageComposer
            scope="Client"
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
