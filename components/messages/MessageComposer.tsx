"use client";

import { useEffect, useRef, useState } from "react";
import {
  addMessage,
  MessageAttachment,
  MessageMention,
  MessageScope,
} from "@/lib/core/messageStore";
import {
  getTeamMemberById,
  TeamMember,
} from "@/lib/core/teamStore";

type Props = {
  scope: MessageScope;
  projectId?: string;
  projectName?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  onSent?: () => void;
};

export default function MessageComposer(props: Props) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<MessageAttachment[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadMembers = async () => {
      try {
        const results = await Promise.all(
          ["OM-001", "AS-001"].map((id) =>
            getTeamMemberById(id)
          )
        );

        if (mounted) {
          setMembers(
            results.filter(
              (member): member is TeamMember =>
                Boolean(member)
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load message mention members",
          error
        );

        if (mounted) {
          setMembers([]);
        }
      }
    };

    void loadMembers();

    return () => {
      mounted = false;
    };
  }, []);

  function parseMentions(text: string): MessageMention[] {
    const found: MessageMention[] = [];

    for (const member of members) {
      if (
        text.includes(`@${member.name}`) ||
        text.includes(`@${member.initials}`)
      ) {
        found.push({
          id: member.id,
          name: member.name,
        });
      }
    }

    return found;
  }

  async function handleFiles(list: FileList | null) {
    if (!list) return;

    const next: MessageAttachment[] = [];

    for (const file of Array.from(list)) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();

        reader.onload = () =>
          resolve(String(reader.result || ""));

        reader.readAsDataURL(file);
      });

      next.push({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl,
      });
    }

    setFiles((current) => [...current, ...next]);
  }

  function send() {
    const clean = body.trim();

    if (!clean && files.length === 0) return;

    addMessage({
      scope: props.scope,
      projectId: props.projectId,
      projectName: props.projectName,
      senderId: props.senderId,
      senderName: props.senderName,
      senderRole: props.senderRole,
      body: clean,
      mentions: parseMentions(clean),
      attachments: files,
      readBy: [props.senderId],
    });

    setBody("");
    setFiles([]);
    setShowMentions(false);
    props.onSent?.();
  }

  function mention(memberName: string) {
    setBody(
      (current) =>
        `${current}${
          current && !current.endsWith(" ") ? " " : ""
        }@${memberName} `
    );

    setShowMentions(false);
    inputRef.current?.focus();
  }

  return (
    <div className="border-t border-white/10 bg-black/20 p-4">
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
            >
              {file.name}

              <button
                type="button"
                onClick={() =>
                  setFiles((current) =>
                    current.filter(
                      (item) => item.id !== file.id
                    )
                  )
                }
                className="ml-2 text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showMentions && (
        <div className="mb-3 rounded-xl border border-white/10 bg-[#111] p-2">
          {members.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => mention(member.name)}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
            >
              @{member.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={inputRef}
          value={body}
          onChange={(event) =>
            setBody(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              send();
            }
          }}
          placeholder="Write a message..."
          className="min-h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-white/25"
        />

        <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 px-3 text-sm hover:bg-white/5">
          +
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </label>

        <button
          type="button"
          onClick={send}
          className="h-11 rounded-xl border border-white/10 px-4 text-sm transition hover:bg-white/10"
        >
          Send
        </button>

        <button
          type="button"
          onClick={() =>
            setShowMentions((current) => !current)
          }
          className="h-11 rounded-xl border border-white/10 px-4 text-sm transition hover:bg-white/10"
        >
          @
        </button>
      </div>
    </div>
  );
}