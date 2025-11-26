// src/services/chatService.js
import api from "./api";

/**
 * Sends a general chat message to backend.
 * Returns { reply, chatId } (whatever your backend responds).
 */
export async function sendGeneralChat(message) {
  const { data } = await api.post("/chats/general", { message });
  return data;
}

/**
 * Sends a document-specific chat message to backend.
 * docId = document._id
 * Returns { reply, chatId }.
 */
export async function sendDocChat(docId, message) {
  const { data } = await api.post(
    `/chats/document/${encodeURIComponent(docId)}`,
    { message }
  );
  return data;
}
