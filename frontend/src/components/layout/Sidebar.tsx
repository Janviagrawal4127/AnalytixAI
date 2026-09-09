"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: "dashboard",
    href: "/dashboard",
  },
  {
    name: "Upload",
    icon: "upload_file",
    href: "/dashboard/upload",
  },
  {
    name: "EDA",
    icon: "monitoring",
    href: "/dashboard/eda",
  },
  {
    name: "Charts",
    icon: "bar_chart",
    href: "/dashboard/charts",
  },
  {
    name: "SQL Studio",
    icon: "terminal",
    href: "/dashboard/sql",
  },
  {
    name: "Predictions",
    icon: "trending_up",
    href: "/dashboard/predictions",
  },
  {
    name: "Insights",
    icon: "tips_and_updates",
    href: "/dashboard/insights",
  },
  {
    name: "Strategy AI",
    icon: "psychology",
    href: "/dashboard/strategy",
  },
  {
    name: "Reports",
    icon: "description",
    href: "/dashboard/reports",
  },
  {
    name: "Chat",
    icon: "forum",
    href: "/dashboard/chat",
  },
  {
    name: "Agents",
    icon: "hub",
    href: "/dashboard/agents",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface/65 backdrop-blur-xl border-r border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.1)] z-50 py-6">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.2)] flex items-center justify-center bg-primary-container">
          <span className="material-symbols-outlined text-on-primary-container text-2xl font-fill">
            analytics
          </span>
        </div>
        <div>
          <h1 className="font-display text-headline-md font-bold text-primary leading-none">
            AnalytixAI
          </h1>
          <span className="font-label text-label-sm text-on-surface-variant">
            Enterprise Tier
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-primary-container/20 text-primary border-r-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-label text-label-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-6 pt-4 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-label text-label-sm text-on-surface-variant">
            Orchestrator Online
          </span>
        </div>
      </div>
    </aside>
  );
}
