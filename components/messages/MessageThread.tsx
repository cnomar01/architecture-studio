"use client";

import { useEffect, useState } from "react";
import {
  getMessages,
  markMessageRead,
  Message,
} from "@/lib/core/messageStore";

type Props = {
  messages: Message[];
  currentUserId: string;
};

export default function MessageThread({ messages, currentUserId }: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    for (const message of messages) {
      markMessageRead(message.id, currentUserId);
    }
    setTick((value) => value + 1);
  }, [messages, currentUserId]);

  if (!messages.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-white/35">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="max-h-[600px] space-y-4 overflow-y-auto p-5">
      {messages.map((message) => {
        const own = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${own ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[78%] ${own ? "items-end" : "items-start"}`}>
              <div className="mb-1 flex items-center gap-2 text-[11px] text-white/35">
                <span>{message.senderName}</span>
                <span>·</span>
                <span>{message.senderRole}</span>
                <span>·</span>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>

              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  own
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.04] text-white"
                }`}
              >
                {message.body && (
                  <p className="whitespace-pre-wrap leading-6">
                    {message.body}
                  </p>
                )}

                {message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className={`rounded-lg px-3 py-2 text-xs ${
                          own ? "bg-black/10" : "bg-black/20"
                        }`}
                      >
                        📎 {attachment.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message.mentions.length > 0 && (
                <div className="mt-1 text-[10px] text-white/30">
                  Mentioned: {message.mentions.map((m) => m.name).join(", ")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
