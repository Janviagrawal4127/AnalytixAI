"use client";

import React, { useState } from "react";

interface InsightCard {
  id: string;
  type: "opportunity" | "risk";
  title: string;
  category: string;
  impact: "High" | "Medium" | "Critical";
  confidence: number;
  agent: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  recommendation: string;
}

const INSIGHTS_DATA: InsightCard[] = [
  {
    id: "INS-101",
    type: "opportunity",
    title: "Quantity is a Strong Driver of Order Size",
    category: "Pricing & Packaging",
    impact: "High",
    confidence: 96,
    agent: "EDA & Ingestion Swarm",
    summary:
      "Statistical correlation between transaction volume and total gross margin shows an elastic curve (Pearson r = 0.82). Tiered volume bundling can drive immediate order value expansion.",
    metricLabel: "Potential Revenue Uplift",
    metricValue: "+$34,500 ARR",
    recommendation: "Introduce multi-license tier discounts (10+ seats) to accelerate volume scaling.",
  },
  {
    id: "INS-102",
    type: "opportunity",
    title: "Niche Margin Scaling in Category: Electronics",
    category: "Product Mix",
    impact: "High",
    confidence: 92,
    agent: "EDA & Preprocessing Agent",
    summary:
      "Electronics product line demonstrates an average margin of 64.2% (12% above platform median) with stable customer retention in North America and Asia-Pacific.",
    metricLabel: "Gross Margin Rate",
    metricValue: "64.2%",
    recommendation: "Reallocate 15% of underperforming ad spend into top-tier Electronics positioning.",
  },
  {
    id: "INS-103",
    type: "opportunity",
    title: "Enterprise Expansion in North America",
    category: "Geographic Expansion",
    impact: "Medium",
    confidence: 88,
    agent: "SQL & Analytics Agent",
    summary:
      "North American accounts maintain a 4.2x LTV-to-CAC ratio, indicating strong payback periods within 3.4 months of onboarding.",
    metricLabel: "LTV / CAC Ratio",
    metricValue: "4.2x (Healthy)",
    recommendation: "Establish dedicated enterprise sales reps focused on Fortune 500 accounts in US/CA.",
  },
  {
    id: "INS-104",
    type: "risk",
    title: "Severe Customer Churn Probability Detected",
    category: "Customer Retention",
    impact: "Critical",
    confidence: 94,
    agent: "Predictive Analytics Agent",
    summary:
      "Logistic regression churn model flags 14 high-value enterprise accounts (LTV > $3,000) showing declining transaction activity over the last 45 days.",
    metricLabel: "Projected Attrition Drag",
    metricValue: "-$42,800 ARR",
    recommendation: "Deploy automated account-health alerts and trigger executive check-in calls.",
  },
  {
    id: "INS-105",
    type: "risk",
    title: "Regional Conversion Drop-off in EU-West",
    category: "Regional Operations",
    impact: "High",
    confidence: 91,
    agent: "Master Orchestrator",
    summary:
      "Post-pricing adjustment analysis shows a 14.8% drop in free-to-paid conversion in Western European accounts compared to previous quarter baseline.",
    metricLabel: "Conversion Variance",
    metricValue: "-14.8%",
    recommendation: "Evaluate localized euro pricing parity and regional payment gateway latency.",
  },
  {
    id: "INS-106",
    type: "risk",
    title: "Margin Compression in Hardware Support",
    category: "Cost Structure",
    impact: "Medium",
    confidence: 85,
    agent: "Insight Generator Agent",
    summary:
      "Gross margin in Hardware Support services has compressed from 44% to 32% due to rising technician overhead and unscheduled on-site dispatches.",
    metricLabel: "Margin Drop",
    metricValue: "32.0% (Warning)",
    recommendation: "Shift Tier-1 troubleshooting to remote automated diagnostics to recover 8% margin.",
  },
];

export default function InsightsPage() {
  const [filter, setFilter] = useState<"all" | "opportunity" | "risk">("all");

  const filteredInsights = INSIGHTS_DATA.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const opportunityCount = INSIGHTS_DATA.filter((i) => i.type === "opportunity").length;
  const riskCount = INSIGHTS_DATA.filter((i) => i.type === "risk").length;

  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xl">tips_and_updates</span>
            <span className="font-label text-xs uppercase tracking-widest text-tertiary font-bold">
              Autonomous Intelligence
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">
            Strategic Insights & Anomaly Detection
          </h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Discovered by EDA, Predictive, and Insight Generator agents scanning dataset patterns and metric shifts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-surface-container/60 border border-white/5 self-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-label font-semibold transition-all flex items-center gap-1.5 ${
              filter === "all"
                ? "bg-primary text-on-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All Findings ({INSIGHTS_DATA.length})
          </button>
          <button
            onClick={() => setFilter("opportunity")}
            className={`px-3 py-1.5 rounded-md text-xs font-label font-semibold transition-all flex items-center gap-1.5 ${
              filter === "opportunity"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-sm">trending_up</span>
            Opportunities ({opportunityCount})
          </button>
          <button
            onClick={() => setFilter("risk")}
            className={`px-3 py-1.5 rounded-md text-xs font-label font-semibold transition-all flex items-center gap-1.5 ${
              filter === "risk"
                ? "bg-error/20 text-error border border-error/30"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-sm">warning</span>
            Risks ({riskCount})
          </button>
        </div>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <span className="material-symbols-outlined text-2xl">arrow_upward</span>
          </div>
          <div>
            <div className="text-xs font-label text-emerald-400 font-semibold uppercase tracking-wider">
              High-Confidence Growth Driver
            </div>
            <div className="text-sm font-bold text-on-surface font-display mt-0.5">
              +$34.5k ARR potential via volume bundling in Electronics & SaaS
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center text-error shrink-0">
            <span className="material-symbols-outlined text-2xl">error</span>
          </div>
          <div>
            <div className="text-xs font-label text-error font-semibold uppercase tracking-wider">
              Primary Revenue Vulnerability
            </div>
            <div className="text-sm font-bold text-on-surface font-display mt-0.5">
              14 accounts exhibiting high-risk churn indicators (-$42.8k ARR exposure)
            </div>
          </div>
        </div>
      </div>

      {/* Insights Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInsights.map((insight) => {
          const isOpp = insight.type === "opportunity";
          return (
            <div
              key={insight.id}
              className={`glass-card rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                isOpp
                  ? "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "border-error/20 hover:border-error/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                      isOpp
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-error/10 text-error border border-error/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isOpp ? "trending_up" : "warning"}
                    </span>
                    {isOpp ? "OPPORTUNITY" : "RISK"}
                  </span>
                  <span className="text-[10px] font-mono text-outline-variant">
                    {insight.confidence}% confidence
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base font-bold text-on-surface mb-2 leading-snug">
                  {insight.title}
                </h3>

                {/* Summary */}
                <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-4">
                  {insight.summary}
                </p>

                {/* Metric Strip */}
                <div className="p-3 rounded-lg bg-surface/50 border border-white/5 flex items-center justify-between mb-4">
                  <span className="text-[11px] font-label text-outline-variant">
                    {insight.metricLabel}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isOpp ? "text-emerald-400" : "text-error"
                    }`}
                  >
                    {insight.metricValue}
                  </span>
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-on-surface leading-normal">
                  <span className="font-semibold text-primary">Action: </span>
                  {insight.recommendation}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-outline">
                    via {insight.agent}
                  </span>
                  <button className="text-[11px] font-label font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-0.5">
                    Deploy
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
