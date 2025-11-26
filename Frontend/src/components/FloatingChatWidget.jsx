import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import robot from "@/assets/robot.png";
import { sendGeneralChat, sendDocChat } from "@/services/chatService";

// --- icons & small components unchanged ---
const EyeIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.33 4.5 12 4.5c4.663 0 8.573 3.007 9.963 7.173a1.012 1.012 0 0 1 0 .639C20.577 16.49 16.67 19.5 12 19.5c-4.663 0-8.573-3.007-9.963-7.173Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const SendIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 2L15 22l-4-9-9-4 20-7z"
    />
  </svg>
);

const ChatContent = () => (
  <div className="flex flex-col space-y-4 h-full p-4 overflow-y-auto custom-scrollbar">
    <div className="flex justify-start">
      <div className="bg-neutral-700/50 backdrop-blur-sm text-neutral-200 p-3 rounded-xl rounded-tl-none max-w-[85%] text-sm">
        Hello! I am Argus, your personal AI Legal Assistant. Upload a document
        to start a conversation.
      </div>
    </div>
    <div className="flex justify-end">
      <div className="bg-blue-600/70 text-white p-3 rounded-xl rounded-br-none max-w-[85%] text-sm">
        What are the main risks associated with the rental agreement I just
        imported?
      </div>
    </div>
    <div className="flex justify-start">
      <div className="bg-neutral-700/50 backdrop-blur-sm text-neutral-200 p-3 rounded-xl rounded-tl-none max-w-[85%] text-sm">
        I've identified 3 potential issues: 1) The termination clause is vague.
        2) Maintenance fees are subject to unilateral change. 3) The default
        interest rate is unusually high (18%).
      </div>
    </div>
  </div>
);

const GridPatternOverlay = () => (
  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

function MessageBubble({ message }) {
  const isUser = message.sender === "user";
  const base = "p-3 rounded-xl max-w-[85%] text-sm";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? `${base} bg-blue-600/70 text-white rounded-br-none`
            : `${base} bg-neutral-700/50 backdrop-blur-sm text-neutral-200 rounded-tl-none`
        }
      >
        {message.text}
      </div>
    </div>
  );
}

// --- FloatingChatWidget (no dragging) ---
export function FloatingChatWidget({
  isVisible = false,
  toggleVisibility = () => {},
  docId = null,
}) {
  const chatRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const storageKey = docId ? `argus_chat_doc_${docId}` : "argus_chat_general";
  const storageChatIdKey = storageKey + "_id";

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw
        ? JSON.parse(raw)
        : [
            {
              id: "welcome",
              sender: "bot",
              text: "Hello! I am Argus, your personal AI Legal Assistant. Upload a document to start a conversation.",
            },
          ];
    } catch {
      return [
        {
          id: "welcome",
          sender: "bot",
          text: "Hello! I am Argus, your personal AI Legal Assistant. Upload a document to start a conversation.",
        },
      ];
    }
  });

  const [chatId, setChatId] = useState(
    () => localStorage.getItem(storageChatIdKey) || null
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
    }
  }, [messages, isVisible]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // if (!isVisible) return null;

  // useEffect(() => {
  //   // optional debug
  //   // console.log("Argus mounted, visible:", isVisible);
  // }, [isVisible]);

  // optional: close on outside click
  useOutsideClick(chatRef, () => {
    if (isVisible) toggleVisibility();
  });

  const pushUserMessage = (text) => {
    const userMsg = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    return userMsg;
  };

  const pushBotMessage = (text) => {
    const botMsg = { id: (Date.now() + 1).toString(), sender: "bot", text };
    setMessages((prev) => [...prev, botMsg]);
    return botMsg;
  };

  const handleSend = async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || isSending) return;

    // push user message to UI
    pushUserMessage(value);
    if (inputRef.current) inputRef.current.value = "";

    // optimistic bot placeholder (optional)
    const placeholder = pushBotMessage("Analyzing…");

    setIsSending(true);
    setError(null);

    try {
      let res;
      if (docId) {
        res = await sendDocChat(docId, value); // { reply, chatId }
      } else {
        res = await sendGeneralChat(value);
      }

      const reply = res?.reply || "No reply from server.";
      // remove placeholder and append real reply:
      setMessages((prev) => {
        // remove the last placeholder if it's ours (match by text "Analyzing…" and sender bot)
        const withoutPlaceholder =
          prev.length > 0 &&
          prev[prev.length - 1].sender === "bot" &&
          prev[prev.length - 1].text === "Analyzing…"
            ? prev.slice(0, -1)
            : prev;
        return [
          ...withoutPlaceholder,
          { id: Date.now().toString(), sender: "bot", text: reply },
        ];
      });

      // persist chatId if returned
      if (res?.chatId) {
        setChatId(res.chatId);
        try {
          localStorage.setItem(storageChatIdKey, res.chatId);
        } catch {}
      }
    } catch (err) {
      console.error("Chat send failed:", err);
      setError(err?.message || "Failed to send message");
      // replace placeholder with an error message
      setMessages((prev) => {
        const withoutPlaceholder =
          prev.length > 0 &&
          prev[prev.length - 1].sender === "bot" &&
          prev[prev.length - 1].text === "Analyzing…"
            ? prev.slice(0, -1)
            : prev;
        return [
          ...withoutPlaceholder,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "Sorry — couldn't reach server.",
          },
        ];
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={chatRef}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: "spring", stiffness: 240, damping: 25 }}
          className="relative z-[99999] pointer-events-auto w-[320px] md:w-[320px] lg:w-[320px] h-[480px] md:h-[520px] bg-[rgba(17,17,17,0.55)] backdrop-blur-lg rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden"
          style={{
            touchAction: "none",
            // boxShadow:
            //   "0 0 18px rgba(126,34,206,0.55), 0 0 60px rgba(37,99,235,0.45)",
            // borderColor: "rgba(126,34,206,0.35)",
          }}
        >
          <div className="flex items-center justify-between p-4 bg-neutral-800/50 border-b border-neutral-700">
            <div className="flex items-center gap-2">
              {/* <EyeIcon className="w-6 h-6 text-purple-400" /> */}
              <img src={robot} alt="Argus Logo" className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-white">Argus</h2>
              <span className="text-xs text-neutral-400">
                {docId ? "Document chat" : "General chat"}
              </span>
              {/* <span className="text-xs text-neutral-400">
                Your AI Legal Assistant
              </span> */}
            </div>
            <button
              onClick={toggleVisibility}
              className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-grow h-[calc(100%-130px)] bg-neutral-900/50">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <GridPatternOverlay />
            </div>
            <div
              ref={scrollRef}
              className="h-full p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isSending && (
                <div className="text-xs text-neutral-400">
                  Waiting for reply...
                </div>
              )}
              {error && (
                <div className="text-xs text-red-400">Error: {error}</div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-neutral-700 bg-neutral-900/80">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your legal query..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-2 pl-4 pr-12 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                aria-label="Type your legal query"
              />

              <button
                type="button"
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
