import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col relative w-full h-full">
      {/* Agent Status Ticker */}
      <div className="ticker-wrap border-b border-white/5 py-2 z-10 relative bg-surface-container-low rounded-t-xl mb-4 overflow-hidden">
        <div className="ticker font-label text-label-sm text-secondary flex gap-8 items-center whitespace-nowrap animate-[ticker_30s_linear_infinite]">
          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">bolt</span> Cleaning Agent solved 14 nulls in Dataset_Alpha.</span>
          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">bolt</span> SQL Agent optimized query #402 for 30% speedup.</span>
          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">bolt</span> Report Agent generated Weekly Summary.</span>
          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">bolt</span> Anomaly Agent detected variance in Stream B.</span>
        </div>
      </div>
      
      {/* Critical Risk Alert */}
      <div className="bg-error-container/20 border-b border-error/30 py-3 px-6 flex justify-between items-center z-10 relative mb-6 rounded-b-xl">
        <div className="flex items-center gap-3 text-error">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <span className="font-label text-label-md">Critical Risk Detected: Data latency spike in Region EU-West.</span>
        </div>
        <button suppressHydrationWarning className="text-error hover:text-white transition-colors">
          <span className="font-label text-label-sm underline">Investigate</span>
        </button>
      </div>

      <div className="flex-1 z-10 relative space-y-stack-lg">
        <header>
          <h2 className="font-display text-display-lg text-on-surface">Central Command</h2>
          <p className="font-body text-body-lg text-on-surface-variant mt-2">Real-time system health and analytics pipeline status.</p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* KPI 1 */}
          <div className="glass-card rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label text-label-md text-on-surface-variant">Active Dataset Rows</span>
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">table_rows</span>
              </div>
            </div>
            <div>
              <div className="font-display text-headline-lg font-bold text-on-surface">1.2M</div>
              <div className="flex items-center gap-1 mt-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="font-label text-label-sm">+12% vs last week</span>
              </div>
            </div>
          </div>
          {/* KPI 2 */}
          <div className="glass-card rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label text-label-md text-on-surface-variant">SQL Queries Executed</span>
              <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">terminal</span>
              </div>
            </div>
            <div>
              <div className="font-display text-headline-lg font-bold text-on-surface">45.2k</div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span className="font-label text-label-sm">Last 24 hours</span>
              </div>
            </div>
          </div>
          {/* KPI 3 */}
          <div className="glass-card rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label text-label-md text-on-surface-variant">Insights Discovered</span>
              <div className="w-8 h-8 rounded bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">tips_and_updates</span>
              </div>
            </div>
            <div>
              <div className="font-display text-headline-lg font-bold text-on-surface">842</div>
              <div className="flex items-center gap-1 mt-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="font-label text-label-sm">34 high confidence</span>
              </div>
            </div>
          </div>
          {/* KPI 4 */}
          <div className="glass-card rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label text-label-md text-on-surface-variant">Active Agent Threads</span>
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
            </div>
            <div>
              <div className="font-display text-headline-lg font-bold text-on-surface">12</div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span className="font-label text-label-sm">Processing concurrent tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Main Chart Area */}
          <div className="glass-card rounded-xl lg:col-span-8 flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-display text-headline-md font-bold text-on-surface">Data Ingestion Profiles</h3>
              <div className="flex gap-2">
                <button suppressHydrationWarning className="px-3 py-1 bg-surface-container-high rounded text-label-sm font-label text-on-surface border border-white/10">1D</button>
                <button suppressHydrationWarning className="px-3 py-1 bg-primary/20 rounded text-label-sm font-label text-primary border border-primary/30">1W</button>
                <button suppressHydrationWarning className="px-3 py-1 bg-surface-container-high rounded text-label-sm font-label text-on-surface border border-white/10">1M</button>
              </div>
            </div>
            <div className="p-6 flex-1 relative min-h-[300px] flex items-end justify-between gap-2">
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                <div className="w-full h-px bg-white/[0.03]"></div>
                <div className="w-full h-px bg-white/[0.03]"></div>
                <div className="w-full h-px bg-white/[0.03]"></div>
                <div className="w-full h-px bg-white/[0.03]"></div>
                <div className="w-full h-px bg-white/[0.03]"></div>
              </div>
              <div className="w-full bg-primary/40 h-[40%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">2.1k</div></div>
              <div className="w-full bg-primary/60 h-[60%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">3.4k</div></div>
              <div className="w-full bg-primary/30 h-[30%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">1.8k</div></div>
              <div className="w-full bg-secondary/70 h-[85%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">5.2k</div></div>
              <div className="w-full bg-primary/50 h-[55%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">3.1k</div></div>
              <div className="w-full bg-primary/80 h-[90%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">6.1k</div></div>
              <div className="w-full bg-primary/40 h-[45%] rounded-t relative group"><div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-container-highest px-2 py-1 rounded text-[10px] transition-opacity z-10 border border-white/10">2.5k</div></div>
              <svg className="absolute inset-0 w-full h-full p-6 pointer-events-none" preserveAspectRatio="none">
                <path className="opacity-80" d="M 0 200 Q 50 150 100 180 T 200 100 T 300 120 T 400 50 T 500 150" fill="none" stroke="#4cd7f6" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
          
          {/* Secondary Info Area */}
          <div className="lg:col-span-4 space-y-gutter flex flex-col">
            <div className="glass-card rounded-xl p-6 flex-1">
              <h3 className="font-display text-headline-md font-bold text-on-surface mb-4">System Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-label text-label-sm text-on-surface-variant">CPU Compute</span>
                    <span className="font-label text-label-sm text-on-surface">64%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: "64%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-label text-label-sm text-on-surface-variant">Memory Allocation</span>
                    <span className="font-label text-label-sm text-on-surface">82%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-label text-label-sm text-on-surface-variant">Storage Capacity</span>
                    <span className="font-label text-label-sm text-error">91%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5">
                    <div className="bg-error h-1.5 rounded-full shadow-[0_0_10px_#ffb4ab]" style={{ width: "91%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-surface to-primary-container/10 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h4 className="font-label text-label-md font-bold text-primary">Auto-Optimization</h4>
              </div>
              <p className="font-body text-body-md text-on-surface-variant text-sm mb-4">AI Agents have successfully reduced query latency by 14% over the last 48 hours without manual intervention.</p>
              <button suppressHydrationWarning className="text-label-sm font-label text-secondary hover:text-white transition-colors flex items-center gap-1">View Log <span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
