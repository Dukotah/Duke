"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";

type Message = {
  from: "user" | "bot";
  text: string;
};

const QUICK_REPLIES = [
  "I need a new website",
  "IT support help",
  "Security audit",
  "Just have a question",
];

const BOT_INTROS: Message[] = [
  {
    from: "bot",
    text: "Hey! 👋 I'm Duke from Copper Bay Tech. What can I help you with today?",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(BOT_INTROS);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"chat" | "collect" | "done">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // After user sends first message, ask for contact info
    setTimeout(() => {
      if (newMessages.filter((m) => m.from === "user").length === 1) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Got it! To make sure Duke can follow up — what's your name and best email?",
          },
        ]);
        setStep("collect");
      }
    }, 600);
  };

  const submitContact = async () => {
    if (!name.trim() || !email.trim()) return;
    const userMessage = messages.find((m) => m.from === "user")?.text || "";
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          business: "Chat Widget",
          service: "other",
          message: userMessage,
        }),
      });
    } catch {}
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: `Thanks ${name}! Duke will be in touch within one business day. In the meantime, feel free to call or text at (707) 239-6725.`,
      },
    ]);
    setStep("done");
  };

  const unreadCount = !open && messages.length > BOT_INTROS.length ? 1 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-[#18181B]/10"
            style={{ backgroundColor: "#fff" }}
          >
            {/* Header */}
            <div className="bg-[#18181B] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F97316] flex items-center justify-center">
                  <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>D</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                    Duke @ Copper Bay Tech
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/50 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                      Usually replies within a day
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-[#FAFAF9]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-[#18181B] text-white rounded-br-sm"
                        : "bg-white border border-[#18181B]/10 text-[#3F3F46] rounded-bl-sm shadow-sm"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 bg-[#FAFAF9]">
                {QUICK_REPLIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => sendMessage(r)}
                    className="px-3 py-1.5 text-xs rounded-full border border-[#18181B]/20 text-[#3F3F46]/80 hover:border-[#18181B]/60 hover:text-[#18181B] transition-colors bg-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Contact collect */}
            {step === "collect" && (
              <div className="p-4 border-t border-[#18181B]/8 bg-white space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#18181B]/15 bg-[#FAFAF9] focus:outline-none focus:ring-1 focus:ring-[#18181B]/30"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#18181B]/15 bg-[#FAFAF9] focus:outline-none focus:ring-1 focus:ring-[#18181B]/30"
                    style={{ fontFamily: "var(--font-body)" }}
                    onKeyDown={(e) => e.key === "Enter" && submitContact()}
                  />
                  <button
                    onClick={submitContact}
                    className="px-3 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-colors"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Chat input */}
            {step === "chat" && (
              <div className="p-4 border-t border-[#18181B]/8 bg-white flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#18181B]/15 bg-[#FAFAF9] focus:outline-none focus:ring-1 focus:ring-[#18181B]/30"
                  style={{ fontFamily: "var(--font-body)" }}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="px-3 py-2 bg-[#18181B] text-white rounded-lg hover:bg-[#111113] transition-colors disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </div>
            )}

            {/* Done state */}
            {step === "done" && (
              <div className="p-4 border-t border-[#18181B]/8 bg-white text-center">
                <a
                  href="tel:+17072396725"
                  className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/60 hover:text-[#18181B] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Phone size={14} /> (707) 239-6725
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 rounded-full bg-[#F97316] text-white shadow-lg hover:bg-[#ea6c0a] transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
