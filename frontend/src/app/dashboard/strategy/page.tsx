"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  {
    icon: "trending_up",
    label: "Revenue Growth Strategy",
    prompt: "Based on our current revenue data, what strategies should we prioritize to grow revenue by 20% next quarter?",
  },
  {
    icon: "person_cancel",
    label: "Reduce Customer Churn",
    prompt: "Our churn rate is concerning. What are the top 3 actions we should take immediately to retain high-value customers?",
  },
  {
    icon: "balance",
    label: "P&L Improvement",
    prompt: "Analyze our profit and loss situation. Where are we bleeding margin and how can we improve profitability?",
  },
  {
    icon: "rocket_launch",
    label: "Market Expansion",
    prompt: "Which geographic regions or product categories should we expand into next for maximum ROI?",
  },
  {
    icon: "savings",
    label: "Cost Optimization",
    prompt: "Where can we cut costs without hurting growth? Identify our highest-impact cost reduction opportunities.",
  },
  {
    icon: "psychology",
    label: "Competitive Strategy",
    prompt: "Do a SWOT analysis of our business position and recommend a competitive differentiation strategy.",
  },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `**Welcome to AnalytixAI Strategy Advisor** 🧑‍💼

I'm your AI-powered Chief Analytics Officer, trained on business strategy frameworks and directly connected to your real analytics data.

I can help you with:
- 📊 **Revenue & P&L Analysis** — understand your profits, losses, and margins
- 🎯 **Strategic Decision Making** — data-backed recommendations with ROI estimates  
- 🔮 **Growth Opportunities** — identify your highest-value expansion vectors
- ⚠️ **Risk Identification** — flag revenue leakage and operational vulnerabilities
- 💡 **Go-to-Market Strategy** — pricing, product mix, regional expansion planning

**I have access to your live analytics data** from the latest pipeline run, so I can give you specific, number-backed advice — not generic recommendations.

What business challenge would you like to tackle today?`,
  timestamp: new Date(),
};

function formatMessage(text: string): React.ReactNode {
  // Simple markdown-like rendering
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p));

    if (line.startsWith("# ")) return <h2 key={i} className="text-base font-bold text-primary mt-3 mb-1">{line.slice(2)}</h2>;
    if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-bold text-on-surface mt-2 mb-1">{line.slice(3)}</h3>;
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return <li key={i} className="ml-4 list-disc text-on-surface leading-relaxed">{rendered.slice(1)}</li>;
    }
    if (line.match(/^\d+\./)) return <li key={i} className="ml-4 list-decimal text-on-surface leading-relaxed">{rendered}</li>;
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-on-surface leading-relaxed">{rendered}</p>;
  });
}

export default function StrategyAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowStarters(false);

    // Build conversation history (exclude welcome)
    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          include_data_context: true,
        }),
      });

      let replyContent = "";
      if (res.ok) {
        const data = await res.json();
        replyContent = data.content || data.message || "I couldn't generate a response. Please try again.";
      } else {
        replyContent =
          "⚠️ Backend server is not running. To enable live AI responses:\n\n" +
          "**Start the backend:**\n```\nuv run python -m uvicorn backend.server:app --port 8000 --reload\n```\n\n" +
          "Once running, I'll provide real data-backed business strategy advice using your analytics.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "⚠️ Cannot reach the backend server at `localhost:8000`.\n\n" +
          "**To enable AI responses, start the backend:**\n" +
          "```\nuv run python -m uvicorn backend.server:app --port 8000 --reload\n```\n\n" +
          "The Strategy Advisor uses Groq Llama 3.3 (70B) with your live analytics data injected as context.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowStarters(true);
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] -m-6 overflow-hidden">
      {/* Left Panel — Context & Starters */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-surface-container-low/60 backdrop-blur-xl h-full overflow-y-auto custom-scrollbar">
        {/* Advisor Identity Card */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/40 to-tertiary/40 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.2)]">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            </div>
            <div>
              <div className="font-display text-sm font-bold text-on-surface">Strategy Advisor</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-mono text-emerald-400">Groq Llama 3.3 70B</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            AI Chief Analytics Officer with access to your live business data — revenue, margins, churn, forecasts, and recommendations.
          </p>
        </div>

        {/* Live Data Badge */}
        <div className="p-4 border-b border-white/5">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Live Data Context</div>
          <div className="space-y-1.5 font-mono text-[11px]">
            {[
              { label: "Pipeline Status", value: "Synced", color: "text-emerald-400" },
              { label: "Data Source", value: "cleaned_data.csv", color: "text-on-surface-variant" },
              { label: "Model", value: "Llama 3.3 70B", color: "text-primary" },
              { label: "Context Window", value: "8,192 tokens", color: "text-on-surface-variant" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-outline-variant">{item.label}</span>
                <span className={item.color}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Prompts */}
        <div className="p-4 flex-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-3">Strategy Templates</div>
          <div className="space-y-2">
            {STARTER_PROMPTS.map((sp) => (
              <button
                key={sp.label}
                onClick={() => sendMessage(sp.prompt)}
                className="w-full text-left p-3 rounded-lg bg-surface/30 hover:bg-surface-container border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">
                    {sp.icon}
                  </span>
                  <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {sp.label}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-snug line-clamp-2">{sp.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Clear Chat */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={clearChat}
            className="w-full py-2 rounded-lg border border-white/10 text-xs font-label text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            New Conversation
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.05),transparent_60%)]">
        {/* Header */}
        <div className="px-6 py-3 border-b border-white/5 bg-surface-container-high/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <div>
              <h2 className="font-display text-sm font-bold text-on-surface">Business Strategy Advisor</h2>
              <p className="text-[11px] text-on-surface-variant font-mono">
                Powered by Groq Llama 3.3 70B · Live data context enabled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Data Context Active
            </span>
            <button
              onClick={clearChat}
              className="lg:hidden p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
              title="New conversation"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 py-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-4xl ${
                msg.role === "user" ? "ml-auto" : "mr-auto"
              } w-full`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-surface-container border border-white/10"
                  : "bg-gradient-to-br from-primary/30 to-tertiary/30 border border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.2)]"
              }`}>
                <span className={`material-symbols-outlined text-sm ${msg.role === "user" ? "text-on-surface-variant" : "text-primary"}`}>
                  {msg.role === "user" ? "person" : "psychology"}
                </span>
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-1 flex-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] font-label font-semibold text-on-surface-variant">
                    {msg.role === "user" ? "You" : "Strategy Advisor"}
                  </span>
                  {msg.role === "assistant" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Llama 3.3
                    </span>
                  )}
                  <span className="text-[10px] text-outline-variant font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-surface-container-highest/60 border border-white/10 text-on-surface"
                    : "rounded-tl-sm bg-surface-container/60 border border-primary/15 shadow-[0_0_20px_rgba(124,58,237,0.08)] text-on-surface"
                }`}>
                  <div className="space-y-0.5">
                    {formatMessage(msg.content)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-4xl mr-auto w-full">
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/30 to-tertiary/30 border border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.2)]">
                <span className="material-symbols-outlined text-sm text-primary">psychology</span>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[11px] font-label font-semibold text-on-surface-variant px-1">Strategy Advisor</span>
                <div className="rounded-2xl rounded-tl-sm px-5 py-4 bg-surface-container/60 border border-primary/15">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                    <span className="material-symbols-outlined text-primary text-sm animate-spin">progress_activity</span>
                    Analyzing your business data...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Starter Prompts (shown when chat is empty) */}
          {showStarters && messages.length === 1 && (
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
              {STARTER_PROMPTS.slice(0, 4).map((sp) => (
                <button
                  key={sp.label}
                  onClick={() => sendMessage(sp.prompt)}
                  className="text-left p-4 rounded-xl bg-surface-container/40 border border-white/5 hover:border-primary/30 hover:bg-surface-container transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">
                      {sp.icon}
                    </span>
                    <span className="text-xs font-semibold text-on-surface">{sp.label}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">{sp.prompt}</p>
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-8 py-4 border-t border-white/5 bg-background/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl border border-white/10 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 overflow-hidden bg-surface-container/50">
              {/* Context indicator */}
              <div className="px-4 pt-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[13px] text-secondary">data_object</span>
                <span className="text-[10px] font-mono text-secondary">Revenue · Margins · Churn · Forecasts injected as context</span>
              </div>

              <div className="flex items-end p-3 gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your business strategy, P&L, growth opportunities, or risk assessment... (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body text-sm resize-none placeholder-outline-variant/60 custom-scrollbar py-2"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="mb-1 p-2.5 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 border border-primary/30 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-outline-variant mt-2 font-mono">
              Strategy Advisor · Groq Llama 3.3 70B · Live analytics context · Press Enter to send
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
