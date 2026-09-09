import React from 'react';

export default function EDAPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-stack-lg pb-10">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="material-symbols-outlined text-sm">folder_open</span>
            <span className="font-label text-label-sm uppercase tracking-wider">Dataset / Customer_Churn_v2.csv</span>
          </div>
          <h2 className="font-display text-display-lg text-white">Exploratory Data Analysis</h2>
          <p className="font-body text-body-lg text-on-surface-variant mt-2 max-w-2xl">Comprehensive profiling and correlation analysis of the active dataset. Review data quality issues before proceeding to model training.</p>
        </div>
        <div className="flex gap-3">
          <button suppressHydrationWarning className="px-4 py-2 rounded border border-secondary text-secondary font-label text-label-md hover:bg-secondary/10 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <button suppressHydrationWarning className="px-4 py-2 rounded bg-gradient-to-r from-primary-container to-inverse-primary text-white font-label text-label-md font-semibold hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
            Generate Visuals
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        {/* KPI 1 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-label-md text-on-surface-variant">Total Records</span>
            <span className="material-symbols-outlined text-primary">dataset</span>
          </div>
          <div className="font-display text-[36px] leading-[44px] font-bold text-white">1,245,092</div>
          <div className="mt-2 flex items-center gap-1 font-label text-label-sm text-tertiary">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+12.5% vs last batch</span>
          </div>
        </div>
        {/* KPI 2 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-label-md text-on-surface-variant">Total Features</span>
            <span className="material-symbols-outlined text-secondary">view_column</span>
          </div>
          <div className="font-display text-[36px] leading-[44px] font-bold text-white">48</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label text-[10px] uppercase border border-secondary/20">32 Num</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label text-[10px] uppercase border border-primary/20">16 Cat</span>
          </div>
        </div>
        {/* KPI 3 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden border-t-error/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-label-md text-on-surface-variant">Missing Cells</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div className="font-display text-[36px] leading-[44px] font-bold text-white">4.2%</div>
          <div className="mt-2 flex items-center gap-1 font-label text-label-sm text-error">
            <span className="material-symbols-outlined text-[14px]">priority_high</span>
            <span>Requires Imputation</span>
          </div>
        </div>
        {/* KPI 4 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-label-md text-on-surface-variant">Memory Usage</span>
            <span className="material-symbols-outlined text-outline">memory</span>
          </div>
          <div className="font-display text-[36px] leading-[44px] font-bold text-white">845 MB</div>
          <div className="mt-2 w-full bg-surface-container-highest rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full shadow-[0_0_8px_#d2bbff]" style={{ width: "45%" }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter mb-stack-lg">
        {/* Left Column: Data Dictionary / Feature Profiling */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl flex flex-col h-[600px]">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-lowest/50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">table_chart</span>
              <h3 className="font-display text-headline-md text-white">Feature Profiling</h3>
            </div>
            <div className="flex gap-2">
              <input suppressHydrationWarning className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 w-48 font-label text-label-sm" placeholder="Filter features..." type="text"/>
              <button suppressHydrationWarning className="p-1.5 rounded bg-surface-variant text-on-surface hover:bg-surface-bright transition-colors border border-white/5">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-0 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface/90 backdrop-blur z-10 shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-label text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-white/10">Feature Name</th>
                  <th className="py-3 px-6 font-label text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-white/10">Type</th>
                  <th className="py-3 px-6 font-label text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-white/10">Missing</th>
                  <th className="py-3 px-6 font-label text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-white/10">Unique</th>
                  <th className="py-3 px-6 font-label text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-white/10">Distribution</th>
                </tr>
              </thead>
              <tbody className="font-body text-[14px]">
                {/* Row 1 */}
                <tr className="border-b border-white/5 hover:bg-surface-variant/30 transition-colors group">
                  <td className="py-3 px-6 text-white font-medium">customer_id</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label text-[10px] uppercase border border-white/10">
                      <span className="material-symbols-outlined text-[12px]">key</span> ID
                    </span>
                  </td>
                  <td className="py-3 px-6 text-tertiary">0%</td>
                  <td className="py-3 px-6 text-white">100%</td>
                  <td className="py-3 px-6">
                    <div className="w-24 h-1 bg-surface-container-highest rounded"><div className="w-full h-full bg-surface-bright rounded"></div></div>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="border-b border-white/5 hover:bg-surface-variant/30 transition-colors group">
                  <td className="py-3 px-6 text-white font-medium">monthly_charges</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label text-[10px] uppercase border border-secondary/20">
                      <span className="material-symbols-outlined text-[12px]">123</span> Numeric
                    </span>
                  </td>
                  <td className="py-3 px-6 text-tertiary">0%</td>
                  <td className="py-3 px-6 text-white">1,584</td>
                  <td className="py-3 px-6">
                    <div className="w-24 h-6 flex items-end gap-[1px]">
                      <div className="w-1 bg-secondary/40 h-[20%]"></div><div className="w-1 bg-secondary/60 h-[40%]"></div><div className="w-1 bg-secondary h-[80%]"></div><div className="w-1 bg-secondary/80 h-[60%]"></div><div className="w-1 bg-secondary/50 h-[30%]"></div><div className="w-1 bg-secondary/30 h-[10%]"></div><div className="w-1 bg-secondary/40 h-[25%]"></div><div className="w-1 bg-secondary/20 h-[5%]"></div>
                    </div>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="border-b border-white/5 hover:bg-surface-variant/30 transition-colors group bg-error/5">
                  <td className="py-3 px-6 text-white font-medium flex items-center gap-2">
                    total_revenue 
                    <span className="material-symbols-outlined text-error text-[14px]">warning</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label text-[10px] uppercase border border-secondary/20">
                      <span className="material-symbols-outlined text-[12px]">123</span> Numeric
                    </span>
                  </td>
                  <td className="py-3 px-6 text-error font-bold">12.4%</td>
                  <td className="py-3 px-6 text-white">6,432</td>
                  <td className="py-3 px-6">
                    <div className="w-24 h-6 flex items-end gap-[1px]">
                      <div className="w-1 bg-error/40 h-[5%]"></div><div className="w-1 bg-error/60 h-[10%]"></div><div className="w-1 bg-error h-[15%]"></div><div className="w-1 bg-error/80 h-[30%]"></div><div className="w-1 bg-error/50 h-[80%]"></div><div className="w-1 bg-error/30 h-[90%]"></div><div className="w-1 bg-error/40 h-[40%]"></div><div className="w-1 bg-error/20 h-[20%]"></div>
                    </div>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="border-b border-white/5 hover:bg-surface-variant/30 transition-colors group">
                  <td className="py-3 px-6 text-white font-medium">contract_type</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary font-label text-[10px] uppercase border border-primary/20">
                      <span className="material-symbols-outlined text-[12px]">category</span> Categorical
                    </span>
                  </td>
                  <td className="py-3 px-6 text-tertiary">0%</td>
                  <td className="py-3 px-6 text-white">3</td>
                  <td className="py-3 px-6">
                    <div className="w-full flex h-2 rounded overflow-hidden">
                      <div className="bg-primary/80 w-[55%]" title="Month-to-month: 55%"></div>
                      <div className="bg-primary/50 w-[25%]" title="One year: 25%"></div>
                      <div className="bg-primary/30 w-[20%]" title="Two year: 20%"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Right Column: Data Quality Checklist */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter h-[600px]">
          <div className="glass-card rounded-xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center border border-error/20 shadow-[0_0_10px_rgba(255,180,171,0.2)]">
                  <span className="material-symbols-outlined text-error text-[18px]">rule</span>
                </div>
                <h3 className="font-display text-headline-md text-white">Quality Issues</h3>
              </div>
              <span className="px-2 py-1 rounded bg-error/20 text-error font-label text-[10px] border border-error/30 uppercase tracking-widest">3 Actions Required</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {/* Issue 1 */}
              <div className="p-4 rounded-lg bg-surface-container-highest/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">data_alert</span>
                  <div>
                    <h4 className="font-label text-label-md text-white">Missing Values in `total_revenue`</h4>
                    <p className="font-body text-[13px] text-on-surface-variant mt-1">12.4% of records are null. Imputation or dropping required for modeling.</p>
                    <div className="mt-3 flex gap-2">
                      <button suppressHydrationWarning className="px-3 py-1.5 rounded bg-surface-bright text-white text-xs hover:bg-primary/20 hover:text-primary transition-colors border border-white/5">Mean Impute</button>
                      <button suppressHydrationWarning className="px-3 py-1.5 rounded bg-surface-bright text-white text-xs hover:bg-primary/20 hover:text-primary transition-colors border border-white/5">Drop Rows</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Issue 2 */}
              <div className="p-4 rounded-lg bg-surface-container-highest/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">insights</span>
                  <div>
                    <h4 className="font-label text-label-md text-white">High Cardinality: `zip_code`</h4>
                    <p className="font-body text-[13px] text-on-surface-variant mt-1">Found 8,432 unique values. Consider hashing or target encoding.</p>
                    <div className="mt-3 flex gap-2">
                      <button suppressHydrationWarning className="px-3 py-1.5 rounded bg-surface-bright text-white text-xs hover:bg-secondary/20 hover:text-secondary transition-colors border border-white/5 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">auto_fix</span> Auto Encode</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Passed Check */}
              <div className="p-4 rounded-lg bg-tertiary/5 border border-tertiary/10 opacity-70">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary mt-0.5 text-[18px]">check_circle</span>
                  <div>
                    <h4 className="font-label text-label-md text-white">No Duplicate Rows</h4>
                    <p className="font-body text-[13px] text-on-surface-variant mt-1">Dataset uniqueness integrity verified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Bottom Section: Correlation Matrix Heatmap */}
      <div className="glass-card rounded-xl p-6 mb-stack-lg">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">grid_view</span>
            <h3 className="font-display text-headline-md text-white">Correlation Matrix (Pearson)</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-label text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span>Negative</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-error via-surface to-secondary"></div>
              <span>Positive</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[800px] aspect-[2/1] relative">
            {/* Labels Y */}
            <div className="absolute left-0 top-8 bottom-0 w-32 flex flex-col justify-around text-right pr-4 font-label text-[11px] text-on-surface-variant">
              <span>tenure</span>
              <span>monthly_charge</span>
              <span>total_revenue</span>
              <span>age</span>
              <span>num_devices</span>
            </div>
            {/* Labels X */}
            <div className="absolute left-32 top-0 right-0 h-8 flex justify-around items-end pb-2 font-label text-[11px] text-on-surface-variant -rotate-45 origin-bottom-left whitespace-nowrap hidden lg:flex">
              <span className="w-1/5 text-center">tenure</span>
              <span className="w-1/5 text-center">monthly_charge</span>
              <span className="w-1/5 text-center">total_revenue</span>
              <span className="w-1/5 text-center">age</span>
              <span className="w-1/5 text-center">num_devices</span>
            </div>
            {/* Heatmap Grid */}
            <div className="absolute left-32 top-8 right-0 bottom-0 grid grid-cols-5 gap-1 p-1 bg-black/40 border border-white/5 rounded">
              {/* Row 1 */}
              <div className="bg-surface border border-white/5 flex items-center justify-center font-label text-xs text-white/30">1.0</div>
              <div className="bg-secondary/40 border border-secondary/20 flex items-center justify-center font-label text-xs text-white shadow-[inset_0_0_10px_rgba(76,215,246,0.2)]">0.65</div>
              <div className="bg-secondary/80 border border-secondary/40 flex items-center justify-center font-label text-xs text-black font-bold shadow-[0_0_15px_rgba(76,215,246,0.4)] z-10">0.92</div>
              <div className="bg-error/10 border border-error/10 flex items-center justify-center font-label text-xs text-white/60">-0.12</div>
              <div className="bg-secondary/20 border border-secondary/10 flex items-center justify-center font-label text-xs text-white/80">0.34</div>
              {/* Row 2 */}
              <div className="bg-secondary/40 border border-secondary/20 flex items-center justify-center font-label text-xs text-white shadow-[inset_0_0_10px_rgba(76,215,246,0.2)]">0.65</div>
              <div className="bg-surface border border-white/5 flex items-center justify-center font-label text-xs text-white/30">1.0</div>
              <div className="bg-secondary/60 border border-secondary/30 flex items-center justify-center font-label text-xs text-black font-semibold">0.78</div>
              <div className="bg-error/30 border border-error/20 flex items-center justify-center font-label text-xs text-white">-0.45</div>
              <div className="bg-secondary/50 border border-secondary/20 flex items-center justify-center font-label text-xs text-black">0.55</div>
              {/* Row 3 */}
              <div className="bg-secondary/80 border border-secondary/40 flex items-center justify-center font-label text-xs text-black font-bold shadow-[0_0_15px_rgba(76,215,246,0.4)] z-10">0.92</div>
              <div className="bg-secondary/60 border border-secondary/30 flex items-center justify-center font-label text-xs text-black font-semibold">0.78</div>
              <div className="bg-surface border border-white/5 flex items-center justify-center font-label text-xs text-white/30">1.0</div>
              <div className="bg-error/20 border border-error/10 flex items-center justify-center font-label text-xs text-white/80">-0.28</div>
              <div className="bg-secondary/30 border border-secondary/20 flex items-center justify-center font-label text-xs text-white">0.42</div>
              {/* Row 4 */}
              <div className="bg-error/10 border border-error/10 flex items-center justify-center font-label text-xs text-white/60">-0.12</div>
              <div className="bg-error/30 border border-error/20 flex items-center justify-center font-label text-xs text-white">-0.45</div>
              <div className="bg-error/20 border border-error/10 flex items-center justify-center font-label text-xs text-white/80">-0.28</div>
              <div className="bg-surface border border-white/5 flex items-center justify-center font-label text-xs text-white/30">1.0</div>
              <div className="bg-error/5 border border-error/5 flex items-center justify-center font-label text-xs text-white/40">-0.05</div>
              {/* Row 5 */}
              <div className="bg-secondary/20 border border-secondary/10 flex items-center justify-center font-label text-xs text-white/80">0.34</div>
              <div className="bg-secondary/50 border border-secondary/20 flex items-center justify-center font-label text-xs text-black">0.55</div>
              <div className="bg-secondary/30 border border-secondary/20 flex items-center justify-center font-label text-xs text-white">0.42</div>
              <div className="bg-error/5 border border-error/5 flex items-center justify-center font-label text-xs text-white/40">-0.05</div>
              <div className="bg-surface border border-white/5 flex items-center justify-center font-label text-xs text-white/30">1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
