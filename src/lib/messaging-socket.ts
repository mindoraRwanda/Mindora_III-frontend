import { io, type Socket } from "socket.io-client";
import type { Message, ConversationParticipant } from "@/types/domain";

const MESSAGING_WS_URL = process.env.NEXT_PUBLIC_MESSAGING_WS_URL ?? "https://api.mindora.rw";

// Best-effort client for the Messaging Service — its OpenAPI spec documents zero REST
// paths, only these Socket.io events in prose. Untested against a running backend; treat
// event/payload shapes here as the best available approximation until verified live.

interface ServerToClientEvents {
  conversation_created: (payload: { _id: string; participants: string[] }) => void;
  joined_conversation: (payload: {
    conversationId: string;
    participant: ConversationParticipant | null;
  }) => void;
  message_history: (payload: { conversationId: string; messages: Message[] }) => void;
  new_message: (payload: Message) => void;
  message_read: (payload: {
    conversationId: string;
    messageId: string;
    readAt: string;
    readBy: string | null;
  }) => void;
  user_typing: (payload: { conversationId: string; userId: string }) => void;
  user_stopped_typing: (payload: { conversationId: string; userId: string }) => void;
  presence_changed: (payload: { userId: string; online: boolean; lastSeen: string }) => void;
  error: (payload: { message: string }) => void;
}

interface ClientToServerEvents {
  register_presence: (payload: { userId: string }) => void;
  heartbeat: () => void;
  logout_presence: () => void;
  create_conversation: (payload: { participants: [string, string] }) => void;
  join_conversation: (payload: { conversationId: string }) => void;
  send_message: (payload: { conversationId: string; content: string; senderId: string }) => void;
  mark_read: (payload: { conversationId: string; messageId: string }) => void;
  typing_start: (payload: { conversationId: string; userId: string }) => void;
  typing_stop: (payload: { conversationId: string; userId: string }) => void;
}

type MessagingSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: MessagingSocket | null = null;

// Recommended client sequence, per the docs: connect, then registerPresence, then
// joinConversation. A 30s heartbeat keeps the 60s Redis presence TTL alive.
export function connectMessagingSocket(): MessagingSocket {
  if (!socket) {
    socket = io(MESSAGING_WS_URL, { autoConnect: false });
  }
  socket.connect();
  return socket;
}

export function disconnectMessagingSocket(): void {
  socket?.disconnect();
}

export function registerPresence(userId: string): void {
  socket?.emit("register_presence", { userId });
}

export function sendHeartbeat(): void {
  socket?.emit("heartbeat");
}

export function logoutPresence(): void {
  socket?.emit("logout_presence");
}

export function createConversation(participants: [string, string]): void {
  socket?.emit("create_conversation", { participants });
}

export function joinConversation(conversationId: string): void {
  socket?.emit("join_conversation", { conversationId });
}

export function sendMessage(conversationId: string, content: string, senderId: string): void {
  socket?.emit("send_message", { conversationId, content, senderId });
}

export function markRead(conversationId: string, messageId: string): void {
  socket?.emit("mark_read", { conversationId, messageId });
}

export function startTyping(conversationId: string, userId: string): void {
  socket?.emit("typing_start", { conversationId, userId });
}

export function stopTyping(conversationId: string, userId: string): void {
  socket?.emit("typing_stop", { conversationId, userId });
}

export type { ServerToClientEvents, ClientToServerEvents, MessagingSocket };
