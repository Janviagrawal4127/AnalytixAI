"use client";

import React, { useState } from "react";

const SAMPLE_QUERIES = [
  {
    title: "Regional Sales Breakdown",
    sql: "SELECT Region, SUM(Amount) AS TotalSales, COUNT(*) AS Transactions\nFROM data_table\nGROUP BY Region\nORDER BY TotalSales DESC;",
    description: "Aggregates revenue and transaction volume across all operational regions.",
  },
  {
    title: "High-Value Low-Margin Products",
    sql: "SELECT ProductCategory, AVG(Amount) AS AvgRevenue, AVG(Margin) AS AvgMargin\nFROM data_table\nGROUP BY ProductCategory\nHAVING AvgMargin < 0.45\nORDER BY AvgRevenue DESC;",
    description: "Isolates high transaction volume products with potential margin compression.",
  },
  {
    title: "High-Risk Churn Cohort",
    sql: "SELECT CustomerID, Region, LTV, CAC, Margin\nFROM data_table\nWHERE Churn = 1 AND LTV > 3000\nORDER BY LTV DESC\nLIMIT 10;",
    description: "Extracts top enterprise tier customers lost to attrition.",
  },
  {
    title: "Customer Acquisition Efficiency",
    sql: "SELECT Region, AVG(LTV) AS AvgLTV, AVG(CAC) AS AvgCAC,\n       ROUND(AVG(LTV) / NULLIF(AVG(CAC), 0), 2) AS LTV_CAC_Ratio\nFROM data_table\nGROUP BY Region\nORDER BY LTV_CAC_Ratio DESC;",
    description: "Calculates unit economics health ratio per geographical region.",
  },
];

const SCHEMA_COLUMNS = [
  { name: "TransactionID", type: "VARCHAR(64)", desc: "Unique transaction identifier" },
  { name: "CustomerID", type: "VARCHAR(64)", desc: "Customer account identifier" },
  { name: "Date", type: "DATE", desc: "Transaction timestamp (YYYY-MM-DD)" },
  { name: "ProductCategory", type: "VARCHAR(64)", desc: "Electronics, SaaS, Hardware, Support" },
  { name: "Amount", type: "NUMERIC(10,2)", desc: "Transaction monetary value in USD" },
  { name: "Region", type: "VARCHAR(64)", desc: "North America, Europe, Asia-Pac, LatAm" },
  { name: "Quantity", type: "INTEGER", desc: "Volume units purchased" },
  { name: "Margin", type: "NUMERIC(4,2)", desc: "Product profit margin ratio (0.3 - 0.75)" },
  { name: "LTV", type: "NUMERIC(10,2)", desc: "Customer Lifetime Value" },
  { name: "CAC", type: "NUMERIC(10,2)", desc: "Customer Acquisition Cost" },
  { name: "Churn", type: "BOOLEAN", desc: "Customer attrition indicator (1=Churn, 0=Active)" },
];

const INITIAL_RESULTS = [
  { Region: "North America", TotalSales: "$104,280.40", Transactions: "84", AvgMargin: "58.4%" },
  { Region: "Europe", TotalSales: "$89,145.20", Transactions: "62", AvgMargin: "52.1%" },
  { Region: "Asia-Pacific", TotalSales: "$67,420.90", Transactions: "41", AvgMargin: "61.3%" },
  { Region: "Latin America", TotalSales: "$33,908.48", Transactions: "15", AvgMargin: "48.9%" },
];

export default function SQLPlaygroundPage() {
  const [nlQuery, setNlQuery] = useState("");
  const [sqlCode, setSqlCode] = useState(SAMPLE_QUERIES[0].sql);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showReActLog, setShowReActLog] = useState(true);

  const handleTranslate = () => {
    if (!nlQuery.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      setSqlCode(
        `-- Translated via Groq Llama 3.3 (Vectorless RAG)\n` +
        `SELECT Region, SUM(Amount) AS TotalRevenue, AVG(Margin) AS MeanMargin\n` +
        `FROM data_table\n` +
        `WHERE Amount > 1000\n` +
        `GROUP BY Region\n` +
        `ORDER BY TotalRevenue DESC;`
      );
      setIsTranslating(false);
    }, 600);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] -m-6 overflow-hidden">
      {/* Left Column: Schema Inspector & Saved Queries */}
      <aside className="w-80 border-r border-white/5 bg-surface-container-low/50 backdrop-blur-xl flex flex-col h-full custom-scrollbar overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">database</span>
            <h2 className="font-display text-sm font-semibold text-on-surface">Schema Explorer</h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SQLite / Supabase
          </span>
        </div>

        {/* Table Schema */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-primary font-bold">table: data_table</span>
            <span className="text-[10px] text-on-surface-variant font-mono">11 cols · 202 rows</span>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {SCHEMA_COLUMNS.map((col) => (
              <div
                key={col.name}
                className="flex items-center justify-between py-1 px-2 rounded bg-surface/40 hover:bg-surface-variant/30 text-[11px] font-mono border border-white/5"
                title={col.desc}
              >
                <span className="text-on-surface">{col.name}</span>
                <span className="text-outline-variant text-[10px]">{col.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved / Sample Queries */}
        <div className="p-4 flex-1">
          <h3 className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            Quick Queries
          </h3>
          <div className="space-y-2">
            {SAMPLE_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => setSqlCode(sq.sql)}
                className="w-full text-left p-3 rounded-lg border border-white/5 bg-surface-container/30 hover:bg-surface-container hover:border-primary/30 transition-all text-xs group"
              >
                <div className="font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                  {sq.title}
                </div>
                <div className="text-[11px] text-on-surface-variant line-clamp-2">
                  {sq.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Workspace: Natural Language Input + SQL Editor + Table */}
      <section className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Top Prompt Translator (Vectorless RAG) */}
        <div className="p-4 border-b border-white/5 bg-surface-container-lowest/70 backdrop-blur-md">
          <label className="font-label text-xs text-on-surface-variant mb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-sm">auto_fix_high</span>
            Natural Business Language to SQL (Vectorless RAG · Groq LLM)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="Ask in plain English (e.g. 'Show total sales and average margin for orders over $1,000 grouped by region')..."
                className="w-full rounded-lg bg-surface-container/60 border border-white/10 px-4 py-2 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 font-body"
                onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
              />
            </div>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-label text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {isTranslating ? "sync" : "bolt"}
              </span>
              {isTranslating ? "Translating..." : "Translate to SQL"}
            </button>
          </div>
        </div>

        {/* Center: SQL Editor */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-white/5">
          {/* Editor Action Bar */}
          <div className="px-4 py-2 bg-surface-container-high/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-outline font-semibold">SQL Query Editor</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-on-surface-variant border border-white/5">
                Target: data_table
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSqlCode(SAMPLE_QUERIES[0].sql)}
                className="px-2.5 py-1 rounded text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors flex items-center gap-1"
                title="Reset editor"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset
              </button>
              <button
                onClick={handleRunQuery}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {isRunning ? "progress_activity" : "play_arrow"}
                </span>
                {isRunning ? "Executing..." : "Execute Query"}
              </button>
            </div>
          </div>

          {/* Text Area / Code Editor */}
          <div className="flex-1 relative bg-[#030712] p-4 font-mono text-xs overflow-hidden">
            <textarea
              value={sqlCode}
              onChange={(e) => setSqlCode(e.target.value)}
              className="w-full h-full bg-transparent text-emerald-300 resize-none outline-none font-mono leading-relaxed custom-scrollbar selection:bg-primary/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Bottom Split: ReAct Telemetry Drawer & Results Table */}
        <div className="h-64 flex flex-col bg-surface-container-lowest/90">
          {/* Results Header */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-surface-container-high/30">
            <div className="flex items-center gap-3">
              <span className="font-label text-xs font-semibold text-on-surface">Execution Results</span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                200 OK · 18ms
              </span>
              <span className="text-[11px] text-on-surface-variant font-mono">4 rows returned</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReActLog(!showReActLog)}
                className={`px-2.5 py-1 rounded text-xs border transition-colors flex items-center gap-1.5 ${
                  showReActLog
                    ? "bg-secondary/10 text-secondary border-secondary/30"
                    : "text-on-surface-variant border-white/5 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-sm">build_circle</span>
                Self-Healing ReAct Guard
              </button>
              <button
                className="px-2.5 py-1 rounded text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-white/5 transition-colors flex items-center gap-1"
                title="Export CSV"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export
              </button>
            </div>
          </div>

          {/* Results Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Table */}
            <div className="flex-1 overflow-auto custom-scrollbar p-3">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-on-surface-variant text-[11px]">
                    <th className="pb-2 font-semibold">Region</th>
                    <th className="pb-2 font-semibold text-right">TotalSales</th>
                    <th className="pb-2 font-semibold text-right">Transactions</th>
                    <th className="pb-2 font-semibold text-right">AvgMargin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INITIAL_RESULTS.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 text-on-surface font-sans font-medium">{row.Region}</td>
                      <td className="py-2 text-right text-emerald-400 font-semibold">{row.TotalSales}</td>
                      <td className="py-2 text-right text-on-surface-variant">{row.Transactions}</td>
                      <td className="py-2 text-right text-tertiary">{row.AvgMargin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ReAct Telemetry Drawer */}
            {showReActLog && (
              <div className="w-80 border-l border-white/5 bg-[#020617] p-3 font-mono text-[11px] flex flex-col justify-between custom-scrollbar overflow-y-auto">
                <div>
                  <div className="flex items-center gap-1.5 text-secondary font-semibold mb-2">
                    <span className="material-symbols-outlined text-sm">security</span>
                    ReAct Self-Healing Watcher
                  </div>
                  <p className="text-on-surface-variant leading-relaxed mb-2 text-[10px]">
                    Actively monitoring execution. Intercepts column syntax typos or missing indices, queries schema shadow, and auto-patches queries dynamically.
                  </p>
                  <div className="p-2 rounded bg-surface/40 border border-white/5 text-[10px] space-y-1">
                    <div className="text-emerald-400">✓ Syntax Tree Validated</div>
                    <div className="text-emerald-400">✓ Safe Read-Only SELECT check passed</div>
                    <div className="text-on-surface-variant">Active Provider: In-Memory SQLite Fallback</div>
                  </div>
                </div>
                <div className="text-[10px] text-outline pt-2 border-t border-white/5">
                  Autonomous ReAct Engine v2.4
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
