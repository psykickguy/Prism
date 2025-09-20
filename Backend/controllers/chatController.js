import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import { asyncHandler } from "../utils/errorHandler.js";
import chatGemini from "../utils/chatGemini.js";

// General chatbot
export const chatGeneral = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Check if chat exists, else create new
  let chat = await Chat.findOne({ type: "general" });
  if (!chat) {
    chat = new Chat({ type: "general", messages: [] });
  }

  // Add user message
  chat.messages.push({ role: "user", content: message });

  // Always prepend bot identity system prompt
  const systemPrompt =
    "You are Argus Bot, a helpful legal assistant. \
You introduce yourself as 'Hey, I am Argus Bot, your AI legal companion.' \
Always stay professional and concise.";

  const response = await chatGemini([
    { role: "system", content: systemPrompt },
    ...chat.messages.map((m) => ({ role: m.role, content: m.content })),
  ]);

  // Save assistant response
  chat.messages.push({ role: "assistant", content: response });
  await chat.save();

  res.json({ reply: response, chatId: chat._id });
});

// Document-specific chatbot
export const chatWithDocument = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { docId } = req.params;

  // Validate document
  const document = await Document.findById(docId);
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  // Find or create chat for this doc
  let chat = await Chat.findOne({ type: "document", documentId: docId });
  if (!chat) {
    chat = new Chat({ type: "document", documentId: docId, messages: [] });
  }

  // Add user message
  chat.messages.push({ role: "user", content: message });

  // Build context
  const docContext = `Here is the text of the legal document:\n${document.extractedText}\n\nNow answer the user's question clearly: ${message}`;

  const response = await chatGemini([
    { role: "system", content: "You are a legal assistant chatbot." },
    { role: "user", content: docContext },
  ]);

  // Save assistant response
  chat.messages.push({ role: "assistant", content: response });
  await chat.save();

  res.json({ reply: response, chatId: chat._id });
});
