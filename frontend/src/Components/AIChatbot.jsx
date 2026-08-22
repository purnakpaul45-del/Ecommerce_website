import React, { useState } from "react";
import axios from "axios";

import {
  Bot,
  Send,
  X,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

const AIChatbot = () => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL;

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! 👋 I'm your AI shopping assistant. What are you looking for today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/ai/chat`,
        {
          message: userMessage,
        }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: response.data.answer,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text:
              response.data.message ||
              "Sorry, I couldn't process that.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FLOATING AI BUTTON */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:scale-105 hover:bg-indigo-700"
        >
          <Bot size={26} />
        </button>
      )}

      {/* CHAT WINDOW */}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[370px] max-w-[calc(100vw-30px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* HEADER */}

          <div className="flex items-center justify-between bg-indigo-600 px-5 py-4 text-white">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={20} />
              </div>

              <div>
                <h3 className="font-bold">
                  AI Shopping Assistant
                </h3>

                <p className="text-xs text-indigo-100">
                  Powered by AI
                </p>
              </div>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <X size={20} />
            </button>

          </div>

          {/* MESSAGES */}

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    item.role === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>

              </div>
            ))}

            {/* LOADING */}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">

                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />

                  Thinking...

                </div>
              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="border-t border-slate-200 bg-white p-3">

            <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about products..."
                rows={1}
                className="max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} />
              </button>

            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              AI can make mistakes. Check product details before purchasing.
            </p>

          </div>

        </div>
      )}
    </>
  );
};

export default AIChatbot;