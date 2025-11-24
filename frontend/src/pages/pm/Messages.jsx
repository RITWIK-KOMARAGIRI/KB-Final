import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

const formatTime = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageBubble = ({ text, time, sender, theme }) => {
  const isMe = sender === "me";

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
        <div className="whitespace-pre-wrap break-words">{text}</div>
        <div className={`text-[10px] mt-1 ${timeClass}`}>{time}</div>
      </div>
    </div>
  );
};

const PmMessages = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const [myEmployeeId, setMyEmployeeId] = useState(null);
  const [otherEmployeeId, setOtherEmployeeId] = useState(
    location.state?.fromEmployeeId || null
  );
  const [otherEmployeeName, setOtherEmployeeName] = useState(
    location.state?.fromEmployeeName || "Selected Employee"
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("users"));
    } catch {
      return null;
    }
  }, []);

  // Resolve PM's own Employee id by matching email
  useEffect(() => {
    const resolveMe = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        const list = Array.isArray(res.data) ? res.data : [];
        const mine = list.find((e) => e.email?.toLowerCase() === user.email.toLowerCase());
        if (mine?._id) setMyEmployeeId(mine._id);
      } catch (err) {
        console.error("Error resolving PM employee id:", err);
        setError("Failed to resolve your PM profile. Messaging may not work.");
      }
    };

    resolveMe();
  }, [user]);

  // Load contact list for sidebar
  useEffect(() => {
    const fetchContacts = async () => {
      if (!myEmployeeId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/contacts/${myEmployeeId}`
        );
        setContacts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching PM contacts:", err);
      }
    };

    fetchContacts();
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, [myEmployeeId]);

  // Load thread when both ids known
  useEffect(() => {
    if (!myEmployeeId || !otherEmployeeId) return;

    const fetchThread = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/messages/thread", {
          params: { a: myEmployeeId, b: otherEmployeeId },
        });

        const mapped = (res.data || []).map((m) => ({
          id: m._id,
          sender:
            m.from && m.from._id && String(m.from._id) === String(myEmployeeId)
              ? "me"
              : "other",
          text: m.content,
          time: m.createdAt ? formatTime(new Date(m.createdAt)) : "",
        }));
        setMessages(mapped);
      } catch (err) {
        console.error("Error fetching PM thread:", err);
        setError("Failed to load conversation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [myEmployeeId, otherEmployeeId]);

  // Auto-scroll
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !myEmployeeId || !otherEmployeeId) return;

    setSending(true);
    setError("");

    const optimistic = {
      id: Date.now(),
      sender: "me",
      text: trimmed,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    try {
      await axios.post("http://localhost:5000/api/messages", {
        fromEmployeeId: myEmployeeId,
        toEmployeeId: otherEmployeeId,
        content: trimmed,
      });
    } catch (err) {
      console.error("Error sending PM reply:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending) sendMessage();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2
              className={`text-xl font-bold tracking-wide ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              PM Messages
            </h2>
            <div
              className={`h-1 w-24 rounded mt-1 ${
                theme === "dark" ? "bg-teal-500" : "bg-blue-600"
              }`}
            />
            <p
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Reply to messages from your team members.
            </p>
          </div>
        </div>

        {(!otherEmployeeId || !myEmployeeId) && (
          <div
            className={`mb-3 text-xs rounded-md px-3 py-2 ${
              theme === "dark"
                ? "bg-slate-800 text-gray-200 border border-slate-700"
                : "bg-blue-50 text-blue-800 border border-blue-100"
            }`}
          >
            {(!otherEmployeeId && "Open this page from a message notification to view a conversation.") ||
              (!myEmployeeId &&
                "Your PM profile could not be resolved. Make sure an Employee record exists for your email.")}
          </div>
        )}

        {error && (
          <div
            className={`mb-3 text-xs rounded-md px-3 py-2 ${
              theme === "dark"
                ? "bg-red-900/50 text-red-200"
                : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <div className="rounded-lg shadow-lg border overflow-hidden flex h-[70vh]">
          {/* Sidebar contact list */}
          <div
            className={`w-1/3 border-r overflow-y-auto ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {contacts.length === 0 ? (
              <div className="p-4 text-xs text-gray-500">No conversations yet.</div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.otherEmployeeId}
                  onClick={async () => {
                    setOtherEmployeeId(c.otherEmployeeId);
                    setOtherEmployeeName(c.otherName);
                    try {
                      await axios.post("http://localhost:5000/api/messages/mark-seen", {
                        meId: myEmployeeId,
                        otherId: c.otherEmployeeId,
                      });
                    } catch (err) {
                      console.error("Error marking PM messages seen:", err);
                    }
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex flex-col border-b border-slate-800"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-100">{c.otherName}</span>
                    <span className="text-[10px] text-gray-400">
                      {c.lastMessageAt && formatTime(new Date(c.lastMessageAt))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400 truncate max-w-[80%]">
                      {c.lastMessage}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Main chat area */}
          <div
            className={`flex-1 flex flex-col ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between ${
                theme === "dark" ? "border-slate-700" : "border-gray-200"
              }`}
            >
            <div>
              <div
                className={`${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                } text-sm font-medium`}
              >
                Conversation with: {otherEmployeeName}
              </div>
              <div
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } text-xs`}
              >
                Messages between you and this employee.
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-3 ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full text-xs text-gray-500">
                Loading conversation...
              </div>
            ) : messages.length === 0 ? (
              <div
                className={`text-xs text-center mt-10 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No messages yet.
              </div>
            ) : (
              messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  text={m.text}
                  time={m.time}
                  sender={m.sender}
                  theme={theme}
                />
              ))
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!sending) sendMessage();
            }}
            className={`px-3 py-3 border-t ${
              theme === "dark"
                ? "border-slate-700 bg-slate-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply..."
                rows={1}
                className={`flex-1 resize-none rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] max-h-36 ${
                  theme === "dark"
                    ? "bg-slate-700 text-gray-100 placeholder:text-gray-400 focus:ring-teal-500 focus:ring-offset-slate-900"
                    : "bg-white text-gray-800 placeholder:text-gray-400 focus:ring-blue-500 focus:ring-offset-gray-100"
                }`}
              />
              <button
                type="submit"
                disabled={sending || !myEmployeeId || !otherEmployeeId}
                className={`h-[44px] px-4 rounded-md text-sm font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                }`}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmMessages;
