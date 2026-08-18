"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowUp } from "lucide-react";
import { sendChatMessage } from "@/lib/ai-api";
import { ApiError } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types/domain";

export function ReflectChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: (message: string) => sendChatMessage({ message, sessionId }),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, crisisLevel: data.crisisLevel },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    chatMutation.mutate(trimmed);
  }

  const errorMessage =
    chatMutation.error instanceof ApiError
      ? chatMutation.error.message
      : chatMutation.isError
        ? "Could not reach Mindora AI right now. Please try again."
        : null;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-6 py-8 lg:px-0 lg:py-10">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">Reflect</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          A safe space to untangle your thoughts, anytime. Not a replacement for care.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-mindora-lavender bg-mindora-purple-bg/40 px-5 py-6 text-center text-[13.5px] text-muted-foreground">
            Start the conversation whenever you&apos;re ready.
          </div>
        )}

        {messages.map((message, i) =>
          message.crisisLevel === 5 ? (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[14px] text-red-800"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-relaxed">{message.content}</p>
            </div>
          ) : (
            <div
              key={i}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-mindora-purple px-4 py-3 text-[14px] text-white"
                  : "mr-auto max-w-[80%] rounded-2xl rounded-bl-md bg-mindora-purple-pale px-4 py-3 text-[14px] text-foreground"
              }
            >
              {message.content}
            </div>
          )
        )}

        {chatMutation.isPending && (
          <div className="mr-auto max-w-[80%] rounded-2xl rounded-bl-md bg-mindora-purple-pale px-4 py-3 text-[14px] text-muted-foreground">
            Thinking…
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {errorMessage && (
        <div className="mt-3 rounded-xl bg-red-100 px-4 py-2.5 text-[13px] font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 flex items-end gap-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          placeholder="What's on your mind?"
          rows={1}
          className="min-h-12 flex-1 resize-none rounded-xl border-border bg-white px-4 py-3 text-[14px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || chatMutation.isPending}
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
