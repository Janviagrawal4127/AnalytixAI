"use client";

import React, { useState } from "react";

const REPORT_SECTIONS = [
  { id: "exec_summary", label: "Executive Summary & KPIs", checked: true },
  { id: "data_quality", label: "Data Quality & Imputation Log", checked: true },
  { id: "eda_metrics", label: "Descriptive Statistics & Correlations", checked: true },
  { id: "forecast_90d", label: "90-Day Revenue Forecast Models", checked: true },
  { id: "churn_matrix", label: "Customer Churn Risk & Attrition", checked: true },
  { id: "insights", label: "Strategic Opportunities & Vulnerabilities", checked: true },
  { id: "recommendations", label: "Prioritized Operational Action Items", checked: true },
];

export default function ReportsPage() {
  const [sections, setSections] = useState(REPORT_SECTIONS);
  const [format, setFormat] = useState<"html" | "pdf" | "markdown">("html");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
    }, 1200);
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] -m-6 overflow-hidden">
      {/* Left Configuration Panel */}
      <aside className="w-88 border-r border-white/5 bg-surface-container-low/50 backdrop-blur-xl flex flex-col h-full custom-scrollbar overflow-y-auto p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-xl">description</span>
          <h2 className="font-display text-base font-bold text-on-surface">Report Builder</h2>
        </div>
        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Assemble statistical metrics, Recharts specs, ML predictions, and strategic recommendations into a unified executive document.
        </p>

        {/* Dataset Selection */}
        <div className="space-y-1.5 mb-5">
          <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Source Dataset
          </label>
          <div className="p-3 rounded-lg bg-surface-container/60 border border-white/5 flex items-center justify-between text-xs font-mono text-on-surface">
            <span>sample_transactions.csv</span>
            <span className="text-[10px] text-emerald-400 font-sans">Cleaned</span>
          </div>
        </div>

        {/* Sections Selection */}
        <div className="space-y-2 mb-6">
          <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Report Sections Included
          </label>
          <div className="space-y-2">
            {sections.map((sec) => (
              <label
                key={sec.id}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface/30 hover:bg-surface-container/40 border border-white/5 cursor-pointer text-xs transition-colors"
              >
                <input
                  type="checkbox"
                  checked={sec.checked}
                  onChange={() => toggleSection(sec.id)}
                  className="rounded border-white/20 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <span className="text-on-surface font-body">{sec.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2 mb-6">
          <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "html", label: "HTML", icon: "code" },
              { id: "pdf", label: "PDF", icon: "picture_as_pdf" },
              { id: "markdown", label: "Markdown", icon: "terminal" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as "html" | "pdf" | "markdown")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                  format === f.id
                    ? "bg-primary/20 border-primary text-primary font-semibold"
                    : "bg-surface/30 border-white/5 text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-lg mb-1">{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-lg bg-primary hover:brightness-110 active:scale-95 text-on-primary font-label text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {isGenerating ? "progress_activity" : "auto_fix_high"}
            </span>
            {isGenerating ? "Compiling Report..." : "Compile Executive Report"}
          </button>

          {generatedSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Report compiled: <strong>data/report.html</strong></span>
            </div>
          )}
        </div>
      </aside>

      {/* Right Document Preview Workspace */}
      <section className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        {/* Top Preview Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-surface-container-high/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-outline font-semibold">Report Live Preview</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-on-surface-variant border border-white/5">
              Target: AnalytixAI_Executive_Summary.html
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/data/report.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-on-surface text-xs font-label font-medium border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Open Full HTML
            </a>
            <button className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs font-label font-semibold border border-primary/30 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
          </div>
        </div>

        {/* Scrollable Report Content Mock */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex justify-center">
          <div className="w-full max-w-4xl bg-surface-container/40 border border-white/10 rounded-xl p-8 shadow-2xl space-y-8">
            {/* Report Header */}
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                    AnalytixAI Autonomous Intelligence Swarm
                  </span>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface mt-1">
                    Quarterly Executive Business Analytics Report
                  </h1>
                  <p className="text-xs text-on-surface-variant mt-1 font-mono">
                    Compiled dynamically on: 2026-09-06 · Dataset: sample_transactions.csv (202 records)
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">analytics</span>
                </div>
              </div>
            </div>

            {/* Section 1: Executive KPI Strip */}
            <div>
              <h2 className="font-display text-base font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">speed</span>
                1. Executive Summary & Core Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-surface/60 border border-white/5">
                  <div className="text-outline-variant text-[10px]">Total Revenue Tracked</div>
                  <div className="text-emerald-400 font-bold text-base mt-0.5">$294,754.98</div>
                </div>
                <div className="p-3 rounded-lg bg-surface/60 border border-white/5">
                  <div className="text-outline-variant text-[10px]">Average Order Value</div>
                  <div className="text-on-surface font-bold text-base mt-0.5">$1,459.18</div>
                </div>
                <div className="p-3 rounded-lg bg-surface/60 border border-white/5">
                  <div className="text-outline-variant text-[10px]">Average Profit Margin</div>
                  <div className="text-tertiary font-bold text-base mt-0.5">54.8%</div>
                </div>
                <div className="p-3 rounded-lg bg-surface/60 border border-white/5">
                  <div className="text-outline-variant text-[10px]">Customer Churn Rate</div>
                  <div className="text-error font-bold text-base mt-0.5">18.2%</div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Quality & Cleaning Audit */}
            <div>
              <h2 className="font-display text-base font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">cleaning_services</span>
                2. Data Quality & Imputation Audit
              </h2>
              <div className="p-4 rounded-lg bg-surface/40 border border-white/5 text-xs space-y-2 font-mono">
                <div className="text-emerald-400">✓ Deduplication: 3 duplicate transaction rows identified and purged.</div>
                <div className="text-on-surface">✓ Null Imputation: 8 null values in &apos;Amount&apos; imputed with median ($1,130.16).</div>
                <div className="text-on-surface">✓ Categorical Imputation: 5 nulls in &apos;ProductCategory&apos; and 4 in &apos;Region&apos; imputed with mode.</div>
                <div className="text-secondary">✓ Outlier Capping: 17 anomalous values in &apos;Amount&apos; capped to 3-sigma boundaries.</div>
              </div>
            </div>

            {/* Section 3: Strategic Opportunities & Vulnerabilities */}
            <div>
              <h2 className="font-display text-base font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                3. Key Strategic Opportunities & Risks
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-bold text-emerald-400">[OPPORTUNITY] Quantity is a Strong Driver of Order Size</div>
                  <p className="text-on-surface-variant mt-1">
                    Transactions with higher unit quantities exhibit strong correlation with margin expansion. Volume licensing tiers recommended.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                  <div className="font-bold text-error">[RISK] Severe Customer Churn Probability Detected</div>
                  <p className="text-on-surface-variant mt-1">
                    14 enterprise accounts demonstrate &gt;70% churn risk over the next 60 days, threatening up to $42.8k in annual recurring revenue.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Operational Recommendations */}
            <div>
              <h2 className="font-display text-base font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">task_alt</span>
                4. Prioritized Operational Recommendations
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-outline-variant text-[11px]">
                      <th className="pb-2">Action Item</th>
                      <th className="pb-2">Expected ROI</th>
                      <th className="pb-2">Timeframe</th>
                      <th className="pb-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 text-on-surface">Trigger Customer Re-engagement Campaigns</td>
                      <td className="py-2 text-emerald-400">Medium ($18k saved)</td>
                      <td className="py-2 text-on-surface-variant">1-2 weeks</td>
                      <td className="py-2 text-error font-bold">P0 Critical</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-on-surface">Allocate Targeted Marketing to High-Margin Electronics</td>
                      <td className="py-2 text-emerald-400">High (+14% margin)</td>
                      <td className="py-2 text-on-surface-variant">1 week</td>
                      <td className="py-2 text-secondary font-bold">P1 High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Footer */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-outline">
              <span>AnalytixAI · 12-Agent Autonomous Swarm</span>
              <span>Generated in 1.4s · Confirmed Validated</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
