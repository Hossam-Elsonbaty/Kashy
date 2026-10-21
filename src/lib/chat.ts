import axios from "axios";
import instance from "../instance";
import type { ChatConversation, ChatModelChoice, ChatResponse, CreditAllowance, SavedChat } from "../models/chat";

export const chatRequestOptions = { skipGlobalLoader: true };
export const chatApi = {
  models: async (signal?: AbortSignal) => (await instance.get<ChatModelChoice[]>("/api/chat/models", { ...chatRequestOptions, signal })).data,
  allowance: async (signal?: AbortSignal) => (await instance.get<CreditAllowance>("/api/chat/allowance", { ...chatRequestOptions, signal })).data,
  conversation: async (id: string, signal?: AbortSignal) => (await instance.get<ChatConversation>(`/api/chat/conversations/${encodeURIComponent(id)}`, { ...chatRequestOptions, signal })).data,
  delete: async (id: string) => instance.delete(`/api/chat/conversations/${encodeURIComponent(id)}`, chatRequestOptions),
  send: async (message: string, conversationId: string | null, modelId: string | null, signal: AbortSignal) =>
    (await instance.post<ChatResponse>("/api/chat/messages", { message, conversationId, modelId }, { ...chatRequestOptions, signal })).data,
};

export function apiError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!axios.isAxiosError(error)) return fallback;
  const body: unknown = error.response?.data;
  if (typeof body === "string") return body;
  if (Array.isArray(body)) return body.filter(value => typeof value === "string").join(" ") || fallback;
  if (body && typeof body === "object") {
    const problem = body as { detail?: unknown; title?: unknown; errors?: Record<string, string[]> };
    if (typeof problem.detail === "string") return problem.detail;
    if (problem.errors) return Object.values(problem.errors).flat().join(" ");
    if (typeof problem.title === "string") return problem.title;
  }
  if (error.response?.status === 429) return "Your request limit has been reached. Check your credits or try again shortly.";
  if (!error.response) return "Could not reach Kashly. The request may have been processed; check your conversation before sending it again.";
  return fallback;
}

export function sessionUser(): { id: string; roles: string[] } | null {
  try {
    const value = JSON.parse(localStorage.getItem("user") ?? "null");
    return value && typeof value.id === "string" ? { id: value.id, roles: Array.isArray(value.roles) ? value.roles : [] } : null;
  } catch { return null; }
}
export function chatIndexKey(userId: string) { return `kashly:chat-index:${userId}`; }
export function readChatIndex(userId: string): SavedChat[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(chatIndexKey(userId)) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is SavedChat => item && typeof item.id === "string" && typeof item.updatedAt === "string").slice(0, 20) : [];
  } catch { return []; }
}
export function saveChatIndex(userId: string, chats: SavedChat[]) {
  // Store IDs/timestamps only; financial answers remain in the authenticated server history.
  try { localStorage.setItem(chatIndexKey(userId), JSON.stringify(chats.slice(0, 20))); } catch { /* Session still works if browser storage is unavailable. */ }
}
export const formatCredits = (value: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value);
