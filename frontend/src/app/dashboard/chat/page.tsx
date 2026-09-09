"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

type ConnStatus = "connecting" | "connected" | "disconnected";

interface LogEntry {
  id: string;
  time: string;
  type: "system" | "agent" | "user" | "error" | "heartbeat";
  agent?: string;
  message: string;
}

const WS_URL = "ws://localhost:8000/ws/telemetry";
const RECONNECT_DELAY = 3000;

export default function ChatPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connStatus, setConnStatus] = useState<ConnStatus>("connecting");
  const [inputVal, setInputVal] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "time">) => {
    setLogs((prev) => [
      ...prev.slice(-200),
      {
        id: Math.random().toString(36).slice(2),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        ...entry,
      },
    ]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setConnStatus("connecting");
    addLog({ type: "system", message: "Connecting to Orchestrator Swarm Telemetry Stream..." });

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnStatus("connected");
        addLog({ type: "system", message: "✅ Connection established to AnalytixAI Orchestrator Swarm" });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "handshake") {
            addLog({ type: "system", message: data.message, agent: data.status });
          } else if (data.type === "heartbeat") {
            // Silent heartbeat — only log if verbose
          } else if (data.type === "agent_event") {
            addLog({ type: "agent", agent: data.agent || "Agent", message: data.message || JSON.stringify(data) });
          } else {
            addLog({ type: "agent", message: JSON.stringify(data) });
          }
        } catch {
          addLog({ type: "agent", message: event.data });
        }
      };

      ws.onerror = () => {
        addLog({ type: "error", message: "WebSocket error — backend may be offline." });
        setConnStatus("disconnected");
      };

      ws.onclose = () => {
        setConnStatus("disconnected");
        addLog({ type: "system", message: "Disconnected. Reconnecting in 3 seconds..." });
        reconnectRef.current = setTimeout(connect, RECONNECT_DELAY);
      };
    } catch {
      setConnStatus("disconnected");
      addLog({ type: "error", message: `Cannot open WebSocket to ${WS_URL}. Start the backend to see live telemetry.` });
      reconnectRef.current = setTimeout(connect, RECONNECT_DELAY);
    }
  }, [addLog]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    const msg = inputVal.trim();
    setInputVal("");
    addLog({ type: "user", message: msg });
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      addLog({ type: "error", message: "Not connected — cannot send message. Waiting for reconnect..." });
    }
  };

  const logColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "system": return "text-primary";
      case "agent": return "text-secondary";
      case "user": return "text-tertiary";
      case "error": return "text-error";
      case "heartbeat": return "text-outline";
      default: return "text-on-surface";
    }
  };

  const logPrefix = (entry: LogEntry) => {
    switch (entry.type) {
      case "system": return "[System]";
      case "user": return "[You]";
      case "error": return "[ERROR]";
      case "agent": return entry.agent ? `[${entry.agent}]` : "[Agent]";
      default: return "[Log]";
    }
  };

  const statusBadge = () => {
    switch (connStatus) {
      case "connected":
        return <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Connected</span>;
      case "connecting":
        return <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>Connecting...</span>;
      case "disconnected":
        return <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-error/10 text-error border border-error/20 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-error"></span>Disconnected</span>;
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] -m-6">
      {/* Center Chat Thread Canvas */}
      <section className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-high/20 via-background to-background">
        {/* Top bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-surface-container-high/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">hub</span>
            <div>
              <h2 className="font-display text-sm font-bold text-on-surface">Orchestrator Swarm Telemetry</h2>
              <p className="text-[11px] text-on-surface-variant font-mono">ws://localhost:8000/ws/telemetry · Live agent events</p>
            </div>
          </div>
          {statusBadge()}
        </div>

        {/* Offline notice */}
        {connStatus === "disconnected" && (
          <div className="mx-6 mt-4 p-4 rounded-lg border border-error/30 bg-error/5 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-sm mt-0.5">wifi_off</span>
            <div className="text-sm">
              <p className="text-error font-semibold font-label">Backend offline — Live telemetry unavailable</p>
              <p className="text-on-surface-variant mt-1 font-mono text-xs">
                Start backend: <code className="text-primary">uv run python -m uvicorn backend.server:app --port 8000 --reload</code>
              </p>
            </div>
          </div>
        )}

        {/* Log Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* System init badge */}
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1 rounded-full bg-surface-container border border-white/5 font-label text-label-sm text-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">memory</span>
              Session Initialized: AnalytixAI Orchestrator Swarm
            </div>
          </div>

          {/* Log entries */}
          <div className="bg-[#020617] rounded-xl border border-white/10 p-4 font-mono text-sm leading-relaxed min-h-[300px]">
            {logs.length === 0 ? (
              <div className="text-outline-variant text-center py-8">Waiting for agent events...</div>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className="hover:bg-white/5 px-1 rounded transition-colors">
                  <span className="text-outline">{entry.time}</span>{" "}
                  <span className={`${logColor(entry.type)} font-semibold`}>{logPrefix(entry)}</span>{" "}
                  <span className="text-on-surface">{entry.message}</span>
                </div>
              ))
            )}
            <div className="text-on-surface mt-2 animate-pulse">_</div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-6 py-4 border-t border-white/5 bg-background/80 backdrop-blur-md">
          <div className="glass-card rounded-xl border border-white/10 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all overflow-hidden flex items-center gap-3 px-4 py-3">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Send a message to the agent swarm... (Enter to send)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-mono text-sm placeholder-outline-variant/60"
            />
            <button
              onClick={sendMessage}
              disabled={!inputVal.trim() || connStatus !== "connected"}
              className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-primary/30"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
          <p className="text-center text-[10px] text-outline-variant mt-2 font-mono">
            WebSocket · Real-time agent telemetry · Auto-reconnect enabled
          </p>
        </div>
      </section>

      {/* Right Sidebar — Agent Fleet */}
      <aside className="hidden xl:flex w-64 flex-col border-l border-white/5 bg-surface-container-low/60 backdrop-blur-xl h-full overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-white/5">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-3">Agent Fleet Status</div>
          <div className="space-y-2">
            {[
              ["orchestrator", "Orchestrator", "text-primary", "bg-primary/10"],
              ["ingestion", "Ingestor", "text-secondary", "bg-secondary/10"],
              ["cleaning", "Data Cleaner", "text-secondary", "bg-secondary/10"],
              ["preprocessing", "Preprocessor", "text-tertiary", "bg-tertiary/10"],
              ["nl_query", "NL Query", "text-primary", "bg-primary/10"],
              ["sql_agent", "SQL ReAct", "text-secondary", "bg-secondary/10"],
              ["eda", "EDA Analyst", "text-tertiary", "bg-tertiary/10"],
              ["visualization", "Visualizer", "text-primary", "bg-primary/10"],
              ["predictive", "Predictive ML", "text-secondary", "bg-secondary/10"],
              ["insight", "Insight", "text-tertiary", "bg-tertiary/10"],
              ["recommendation", "Recommender", "text-primary", "bg-primary/10"],
              ["report", "Report Gen", "text-secondary", "bg-secondary/10"],
            ].map(([key, label, textCls, bgCls]) => (
              <div key={key} className={`flex items-center gap-2 p-2 rounded-lg ${bgCls} border border-white/5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${connStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-outline"}`}></span>
                <span className={`text-xs font-mono ${textCls}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-3">Session Info</div>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { label: "Protocol", value: "WebSocket" },
              { label: "Endpoint", value: "/ws/telemetry" },
              { label: "Reconnect", value: "Auto (3s)" },
              { label: "Max Log", value: "200 entries" },
              { label: "Status", value: connStatus === "connected" ? "Live" : "Offline" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-1 border-b border-white/5">
                <span className="text-outline-variant">{row.label}</span>
                <span className={connStatus === "connected" ? "text-emerald-400" : "text-outline"}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
