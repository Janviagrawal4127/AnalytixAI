import React from 'react';

export default function ChartsPage() {
  return (
    <div className="flex w-full h-[calc(100vh-6rem)] -m-6">
      {/* Left Sidebar (Config Panel) */}
      <aside className="w-80 border-r border-white/5 glass-card h-full overflow-y-auto z-10 flex flex-col custom-scrollbar">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display text-headline-md text-on-surface text-[18px]">Chart Configuration</h2>
          <button suppressHydrationWarning className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
        </div>
        <div className="p-4 flex flex-col gap-6">
          {/* Chart Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-label text-label-md text-on-surface-variant">Chart Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary-container/20 border border-primary text-primary transition-colors">
                <span className="material-symbols-outlined mb-1">bar_chart</span>
                <span className="text-[10px] font-semibold">Bar</span>
              </button>
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container border border-white/5 text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined mb-1">show_chart</span>
                <span className="text-[10px] font-semibold">Line</span>
              </button>
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container border border-white/5 text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined mb-1">area_chart</span>
                <span className="text-[10px] font-semibold">Area</span>
              </button>
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container border border-white/5 text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined mb-1">scatter_plot</span>
                <span className="text-[10px] font-semibold">Scatter</span>
              </button>
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container border border-white/5 text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined mb-1">pie_chart</span>
                <span className="text-[10px] font-semibold">Pie</span>
              </button>
              <button suppressHydrationWarning className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container border border-white/5 text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined mb-1">map</span>
                <span className="text-[10px] font-semibold">Heat</span>
              </button>
            </div>
          </div>
          {/* Data Mapping */}
          <div className="flex flex-col gap-4">
            <h3 className="font-label text-label-sm text-primary uppercase tracking-wider">Data Mapping</h3>
            <div className="flex flex-col gap-1">
              <label className="font-label text-label-sm text-on-surface-variant">X-Axis (Dimension)</label>
              <select suppressHydrationWarning className="w-full rounded-md text-sm py-2 bg-transparent border-white/10 input-field text-on-surface">
                <option className="bg-surface text-on-surface">Month (Date)</option>
                <option className="bg-surface text-on-surface">Region</option>
                <option className="bg-surface text-on-surface">Product Category</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label text-label-sm text-on-surface-variant">Y-Axis (Measure)</label>
              <select suppressHydrationWarning className="w-full rounded-md text-sm py-2 bg-transparent border-white/10 input-field text-on-surface">
                <option className="bg-surface text-on-surface">Total Revenue ($)</option>
                <option className="bg-surface text-on-surface">Active Users</option>
                <option className="bg-surface text-on-surface">Conversion Rate (%)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label text-label-sm text-on-surface-variant">Group By (Optional)</label>
              <select suppressHydrationWarning className="w-full rounded-md text-sm py-2 bg-transparent border-white/10 input-field text-on-surface">
                <option className="bg-surface text-on-surface">None</option>
                <option className="bg-surface text-on-surface">Customer Segment</option>
                <option className="bg-surface text-on-surface">Subscription Tier</option>
              </select>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/5"></div>
          {/* Styling Options */}
          <div className="flex flex-col gap-4">
            <h3 className="font-label text-label-sm text-primary uppercase tracking-wider">Appearance</h3>
            <div className="flex flex-col gap-2">
              <label className="font-label text-label-sm text-on-surface-variant">Color Palette</label>
              <div className="flex gap-2">
                <div className="w-full h-8 rounded-md cursor-pointer border border-primary p-1 bg-surface-container">
                  <div className="w-full h-full rounded-sm flex">
                    <div className="flex-1 bg-primary"></div>
                    <div className="flex-1 bg-secondary"></div>
                    <div className="flex-1 bg-tertiary"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="font-label text-label-sm text-on-surface-variant">Show Gridlines</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input suppressHydrationWarning defaultChecked className="sr-only peer" type="checkbox" value=""/>
                <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="font-label text-label-sm text-on-surface-variant">Show Legend</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input suppressHydrationWarning defaultChecked className="sr-only peer" type="checkbox" value=""/>
                <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-white/5">
          <button suppressHydrationWarning className="w-full glow-button rounded-lg py-2 flex items-center justify-center gap-2 text-white font-label text-label-md bg-gradient-to-r from-primary-container to-primary-container/80 transition-all hover:-translate-y-px hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <span className="material-symbols-outlined text-[18px]">magic_button</span>
            Generate Chart
          </button>
        </div>
      </aside>
      
      {/* Right Canvas (Preview Area) */}
      <section className="flex-1 p-6 flex flex-col h-full overflow-hidden relative">
        {/* Canvas Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface">Revenue Growth by Segment</h2>
            <p className="font-body text-body-md text-on-surface-variant">Monthly recurring revenue projection for Q3.</p>
          </div>
          <div className="flex gap-3">
            <button suppressHydrationWarning className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors text-sm">
              <span className="material-symbols-outlined text-[18px]">code</span>
              Copy Config
            </button>
            <button suppressHydrationWarning className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition-colors text-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export SVG
            </button>
          </div>
        </div>
        
        {/* Main Chart Container */}
        <div className="flex-1 glass-card rounded-xl p-6 flex flex-col relative overflow-hidden group">
          {/* Decorative ambient light behind chart */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          {/* Legend */}
          <div className="flex justify-end gap-6 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]"></div>
              <span className="font-label text-label-sm text-on-surface-variant">Enterprise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-secondary shadow-[0_0_8px_rgba(76,215,246,0.5)]"></div>
              <span className="font-label text-label-sm text-on-surface-variant">Pro</span>
            </div>
          </div>
          
          {/* Simulated Recharts Area/Bar SVG */}
          <div className="flex-1 w-full relative z-10">
            <svg className="overflow-visible" height="100%" preserveAspectRatio="none" viewBox="0 0 800 400" width="100%">
              <defs>
                <linearGradient id="gradientPrimary" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#d2bbff" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#d2bbff" stopOpacity="0.1"></stop>
                </linearGradient>
                <linearGradient id="gradientSecondary" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.1"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <path className="stroke-white/5" d="M 50 350 L 780 350" strokeDasharray="4 4" strokeWidth="1"></path>
              <path className="stroke-white/5" d="M 50 275 L 780 275" strokeDasharray="4 4" strokeWidth="1"></path>
              <path className="stroke-white/5" d="M 50 200 L 780 200" strokeDasharray="4 4" strokeWidth="1"></path>
              <path className="stroke-white/5" d="M 50 125 L 780 125" strokeDasharray="4 4" strokeWidth="1"></path>
              <path className="stroke-white/5" d="M 50 50 L 780 50" strokeDasharray="4 4" strokeWidth="1"></path>
              
              {/* Y-Axis Labels */}
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="end" x="40" y="355">0k</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="end" x="40" y="280">25k</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="end" x="40" y="205">50k</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="end" x="40" y="130">75k</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="end" x="40" y="55">100k</text>
              
              {/* X-Axis Labels */}
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="90" y="375">Jan</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="210" y="375">Feb</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="330" y="375">Mar</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="450" y="375">Apr</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="570" y="375">May</text>
              <text className="fill-on-surface-variant text-xs font-body" textAnchor="middle" x="690" y="375">Jun</text>
              
              {/* Data Series 1 (Secondary - Pro) Area */}
              <path d="M 90 350 L 90 290 L 210 240 L 330 250 L 450 180 L 570 150 L 690 120 L 690 350 Z" fill="url(#gradientSecondary)"></path>
              <path className="drop-shadow-[0_0_8px_rgba(76,215,246,0.5)]" d="M 90 290 L 210 240 L 330 250 L 450 180 L 570 150 L 690 120" fill="none" stroke="#4cd7f6" strokeWidth="3"></path>
              
              {/* Data Points Series 1 */}
              <circle cx="90" cy="290" fill="#4cd7f6" r="4"></circle>
              <circle cx="210" cy="240" fill="#4cd7f6" r="4"></circle>
              <circle cx="330" cy="250" fill="#4cd7f6" r="4"></circle>
              <circle cx="450" cy="180" fill="#4cd7f6" r="4"></circle>
              <circle cx="570" cy="150" fill="#4cd7f6" r="4"></circle>
              <circle cx="690" cy="120" fill="#4cd7f6" r="4"></circle>
              
              {/* Data Series 2 (Primary - Enterprise) Area */}
              <path d="M 90 350 L 90 320 L 210 280 L 330 210 L 450 140 L 570 90 L 690 60 L 690 350 Z" fill="url(#gradientPrimary)"></path>
              <path className="drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]" d="M 90 320 L 210 280 L 330 210 L 450 140 L 570 90 L 690 60" fill="none" stroke="#d2bbff" strokeWidth="3"></path>
              
              {/* Data Points Series 2 */}
              <circle cx="90" cy="320" fill="#0b1326" r="5" stroke="#d2bbff" strokeWidth="2"></circle>
              <circle cx="210" cy="280" fill="#0b1326" r="5" stroke="#d2bbff" strokeWidth="2"></circle>
              <circle cx="330" cy="210" fill="#0b1326" r="5" stroke="#d2bbff" strokeWidth="2"></circle>
              
              {/* Active Hover State Point */}
              <circle className="animate-pulse shadow-[0_0_10px_#d2bbff]" cx="450" cy="140" fill="#d2bbff" r="7"></circle>
              <line stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" strokeWidth="1" x1="450" x2="450" y1="50" y2="350"></line>
              <circle cx="570" cy="90" fill="#0b1326" r="5" stroke="#d2bbff" strokeWidth="2"></circle>
              <circle cx="690" cy="60" fill="#0b1326" r="5" stroke="#d2bbff" strokeWidth="2"></circle>
            </svg>
            
            {/* Simulated Interactive Tooltip */}
            <div className="absolute bg-surface-container/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-lg flex flex-col gap-2 z-20 pointer-events-none" style={{ left: "calc(450px/800 * 100%)", top: "20%", transform: "translateX(-50%)" }}>
              <span className="font-label text-label-sm text-on-surface-variant border-b border-white/10 pb-1">April 2024</span>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-on-surface">Enterprise</span>
                <span className="text-sm font-bold text-white ml-auto">$71,000</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-sm text-on-surface">Pro</span>
                <span className="text-sm font-bold text-white ml-auto">$58,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
