import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

// Simple helper to format HH:MM am/pm
const formatTime = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Message bubble component
const MessageBubble = ({ text, time, sender, theme }) => {
  const isMe = sender === "me";
  const baseText = theme === "dark" ? "text-gray-100" : "text-gray-800";

  const bubbleClass = isMe
    ? theme === "dark"
      ? "bg-teal-600 text-white"
      : "bg-blue-600 text-white"
    : theme === "dark"
    ? "bg-slate-700 text-gray-100"
    : "bg-gray-100 text-gray-800";

  const timeClass = isMe
    ? "text-white/80"
    : theme === "dark"
    ? "text-gray-400"
    : "text-gray-500";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] rounded-2xl px-4 py-2 shadow ${bubbleClass}`}>
        <div className={`whitespace-pre-wrap break-words ${isMe ? "" : baseText}`}>{text}</div>
        <div className={`text-[10px] mt-1 ${timeClass}`}>{time}</div>
      </div>
    </div>
  );
};

const Messenger = () => {
  const { theme } = useContext(ThemeContext);

  const me = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("users"));
      return {
        id: stored?._id || stored?.id || stored?.email || "me",
        name: stored?.name || "You",
      };
    } catch {
      return { id: "me", name: "You" };
    }
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hi there! How can HR help you today?", time: formatTime(new Date(Date.now() - 1000 * 60 * 5)) },
    { id: 2, sender: "me", text: "Hello! I had a question about my leave balance.", time: formatTime(new Date(Date.now() - 1000 * 60 * 4)) },
    { id: 3, sender: "other", text: "Sure! Please share the dates you have in mind.", time: formatTime(new Date(Date.now() - 1000 * 60 * 3)) },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const endRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = endRef.current;
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: trimmed, time: formatTime() },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold tracking-wide ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
              Messenger
            </h2>
            <div className={`h-1 w-16 rounded mt-1 ${theme === "dark" ? "bg-teal-500" : "bg-blue-600"}`} />
          </div>
        </div>

        {/* Chat Card */}
        <div
          className={`rounded-lg shadow-lg border overflow-hidden flex flex-col h-[70vh] ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Conversation Header */}
          <div
            className={`px-4 py-3 border-b flex items-center gap-3 ${
              theme === "dark" ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-white shadow ${
                theme === "dark" ? "bg-teal-600" : "bg-blue-600"
              }`}
            >
              {me.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <div className={`${theme === "dark" ? "text-gray-100" : "text-gray-800"} text-sm font-medium`}>
                {me.name}
              </div>
              <div className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`}>
                You • Online
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div
            ref={listRef}
            className={`flex-1 overflow-y-auto p-4 space-y-3 ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} text={m.text} time={m.time} sender={m.sender} theme={theme} />
            ))}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className={`px-3 py-3 border-t ${theme === "dark" ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className={`flex-1 resize-none rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] max-h-36 ${
                  theme === "dark"
                    ? "bg-slate-700 text-gray-100 placeholder:text-gray-400 focus:ring-teal-500 focus:ring-offset-slate-900"
                    : "bg-white text-gray-800 placeholder:text-gray-400 focus:ring-blue-500 focus:ring-offset-gray-100"
                }`}
              />
              <button
                type="submit"
                className={`h-[44px] px-4 rounded-md text-sm font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 focus:ring-offset-slate-900"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-100"
                }`}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messenger;