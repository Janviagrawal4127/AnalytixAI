"use client";
import Image from "next/image";

export default function Topbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 z-40 bg-surface/65 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-6">
      {/* Left side: Mobile Brand Header or Search Bar */}
      <div className="flex items-center gap-4">
        <span className="md:hidden font-display text-headline-md font-bold text-primary">
          AnalytixAI
        </span>
        
        {/* Search Input */}
        <div className="hidden md:flex items-center bg-black/20 border border-white/10 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-colors w-64">
          <span className="material-symbols-outlined text-on-surface-variant mr-2" style={{ fontSize: "18px" }}>
            search
          </span>
          <input
            className="bg-transparent border-none outline-none text-label-md font-label text-on-surface placeholder-on-surface-variant/50 w-full p-0 focus:ring-0"
            placeholder="Search Data, Insights..."
            type="text"
          />
        </div>
      </div>

      {/* Right side: Actions & User Avatar */}
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-all duration-200 p-1 rounded-full hover:bg-white/5 active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all duration-200 p-1 rounded-full hover:bg-white/5 active:scale-95">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all duration-200 p-1 rounded-full hover:bg-white/5 active:scale-95">
          <span className="material-symbols-outlined">help</span>
        </button>
        
        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer hover:border-primary transition-colors relative">
          <Image
            className="object-cover"
            alt="Profile Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0j830RYKTe7tVq9duDkswJfP7R7LYIZPZaB8ERhSlC6wQHMLBw9A3ol1kNjp90-Tt5bTC1_HOeNdjzEYqkcIJk6PIZsyZlThopS7P_UnWU2RJdKoI11BkOy7t1EvvXQbGQoyuQXqCbUn-6nY8EXN78JANw7eX4cvlX9Av32hkpUAmjODrHMhGH7-S-8_TBbdw8n7n-_f0_Omi7bT1SH2U5SE0VDWTPnVe0jo4b38BZh0a_O6qqK4O-g"
            fill
            sizes="32px"
            unoptimized
          />
        </div>
      </div>
    </nav>
  );
}
