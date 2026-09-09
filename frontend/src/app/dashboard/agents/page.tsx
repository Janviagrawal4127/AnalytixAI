"use client";

import React, { useState, useEffect, useRef } from 'react';

type AgentStatus = 'Running' | 'Thinking' | 'Idle' | 'Failed' | 'Ready';

interface AgentCardProps {
  name: string;
  description: string;
  status: AgentStatus;
  cpu: string;
  ram: string;
  sparkline: number[];
}

function AgentCard({ name, description, status, cpu, ram, sparkline }: AgentCardProps) {
  const statusColors: Record<AgentStatus, string> = {
    Running: 'text-secondary',
    Thinking: 'text-primary',
    Idle: 'text-outline',
    Ready: 'text-emerald-400',
    Failed: 'text-error',
  };
  const dotColors: Record<AgentStatus, string> = {
    Running: 'bg-secondary animate-pulse shadow-[0_0_10px_rgba(76,215,246,0.4)]',
    Thinking: 'bg-primary animate-ping shadow-[0_0_10px_rgba(124,58,237,0.4)]',
    Idle: 'bg-outline',
    Ready: 'bg-emerald-400 animate-pulse',
    Failed: 'bg-error shadow-[0_0_10px_rgba(255,180,171,0.4)]',
  };
  const barColors: Record<AgentStatus, string> = {
    Running: 'bg-secondary',
    Thinking: 'bg-primary',
    Idle: 'bg-outline opacity-30',
    Ready: 'bg-emerald-400',
    Failed: 'bg-error',
  };
  const borderAccent = status === 'Failed' ? 'border border-error/30 bg-error/5' : '';

  return (
    <div className={`glass-card rounded-lg p-4 relative group transition-colors cursor-pointer ${borderAccent}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColors[status]}`}></div>
          <span className={`font-label text-label-sm tracking-wide uppercase ${statusColors[status]}`}>{status}</span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">more_vert</span>
      </div>
      <h4 className="font-display text-lg font-semibold text-on-surface">{name}</h4>
      <p className={`font-body text-sm mt-1 mb-4 h-10 overflow-hidden ${status === 'Failed' ? 'text-error' : 'text-on-surface-variant'}`}>{description}</p>
      <div className="h-10 w-full mb-4 border-b border-white/5 relative flex items-end">
        <div className="w-full flex items-end gap-[2px] h-full opacity-60">
          {sparkline.map((h, i) => (
            <div key={i} className={`flex-1 ${barColors[status]}`} style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
      <div className={`flex justify-between text-xs font-mono ${status === 'Failed' ? 'text-error' : 'text-on-surface-variant'}`}>
        <span>CPU: {cpu}</span>
        <span>RAM: {ram}</span>
      </div>
    </div>
  );
}

// Map API fleet names to display names and descriptions
const AGENT_META: Record<string, { display: string; description: string; sparkline: number[] }> = {
  orchestrator:    { display: 'Orchestrator',      description: 'Routes tasks across the 12-agent fleet based on user intent', sparkline: [60,70,80,65,90,85] },
  ingestion:       { display: 'Data Ingestor',     description: 'Reads and validates CSV, JSON, Parquet uploads into memory', sparkline: [30,50,40,80,100,90] },
  cleaning:        { display: 'Data Cleaner',      description: 'Imputes nulls, removes outliers, standardizes schema', sparkline: [45,60,70,55,80,75] },
  preprocessing:   { display: 'Preprocessor',      description: 'Feature encoding, normalization and train/test splitting', sparkline: [20,40,55,45,65,60] },
  nl_query:        { display: 'NL Query Agent',    description: 'Translates natural language to SQL using Groq Llama 3.3', sparkline: [50,65,80,70,85,90] },
  sql_agent:       { display: 'SQL ReAct Agent',   description: 'Self-healing SQL executor with vectorless RAG', sparkline: [30,45,60,50,70,65] },
  eda:             { display: 'EDA Analyst',        description: 'Calculates descriptive stats, correlations, distributions', sparkline: [15,30,25,45,40,55] },
  visualization:   { display: 'Visualizer',         description: 'Renders chart specs for bar, line, scatter and heatmap', sparkline: [20,35,50,40,60,55] },
  predictive:      { display: 'Predictive ML',     description: 'Trains revenue forecasting and churn detection models', sparkline: [70,80,90,85,95,88] },
  insight:         { display: 'Insight Agent',     description: 'Derives opportunity and risk insights from analytics output', sparkline: [40,55,65,60,75,70] },
  recommendation:  { display: 'Recommender',       description: 'Generates ranked strategic recommendations with ROI', sparkline: [35,50,60,55,70,65] },
  report:          { display: 'Report Generator',  description: 'Compiles HTML/PDF executive report from all agent outputs', sparkline: [25,40,55,45,65,60] },
};

interface ConsoleLog {
  time: string;
  agent: string;
  agentColor: string;
  msg: string;
  msgColor: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_AGENTS: AgentCardProps[] = Object.entries(AGENT_META).map(([_k, meta]) => ({
  name: meta.display,
  description: meta.description,
  status: 'Ready' as AgentStatus,
  cpu: '0%',
  ram: '0.0G',
  sparkline: meta.sparkline,
}));

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentCardProps[]>(DEFAULT_AGENTS);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { time: new Date().toLocaleTimeString(), agent: '[System]', agentColor: 'text-primary', msg: 'Connecting to agent swarm...', msgColor: 'text-on-surface-variant' },
  ]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [agentCount, setAgentCount] = useState(12);
  const consoleRef = useRef<HTMLDivElement>(null);

  const addLog = (agent: string, msg: string, agentColor = 'text-secondary', msgColor = 'text-on-surface') => {
    setConsoleLogs(prev => [...prev.slice(-50), {
      time: new Date().toLocaleTimeString(),
      agent: `[${agent}]`,
      agentColor,
      msg,
      msgColor,
    }]);
    setTimeout(() => { consoleRef.current?.scrollTo(0, consoleRef.current.scrollHeight); }, 50);
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Not ok');
      const data = await res.json();
      setBackendOnline(true);
      setAgentCount(data.agents_available || 12);

      // Update agents with real fleet info
      const fleet: string[] = data.fleet || [];
      setAgents(DEFAULT_AGENTS.map((agent, i) => {
        const agentKey = fleet[i] || Object.keys(AGENT_META)[i];
        const meta = AGENT_META[agentKey] || { display: agent.name, description: agent.description, sparkline: agent.sparkline };
        return {
          ...agent,
          name: meta.display,
          description: meta.description,
          status: data.orchestrator_status === 'ready' ? 'Ready' : 'Idle',
        };
      }));

      addLog('System', `Fleet online — ${data.agents_available} agents ready. Orchestrator: ${data.orchestrator_status}`, 'text-primary', 'text-on-surface-variant');
    } catch {
      setBackendOnline(false);
      addLog('System', 'Backend offline — showing demo mode. Start backend to see live telemetry.', 'text-error', 'text-error');
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate activity logs when online
  useEffect(() => {
    if (!backendOnline) return;
    const messages = [
      ['Orchestrator', 'Hub-and-spoke routing active. Monitoring task queue.', 'text-primary'],
      ['Data Cleaner', 'Null imputation complete on cleaned_data.csv', 'text-secondary'],
      ['Predictive ML', 'Revenue forecast model loaded. 90-day horizon active.', 'text-tertiary'],
      ['NL Query', 'Vector embeddings refreshed for schema RAG context.', 'text-secondary'],
      ['Report Gen', 'Awaiting pipeline trigger to compile executive report.', 'text-on-surface-variant'],
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        const [agent, msg, color] = messages[i++];
        addLog(agent, msg, color, 'text-on-surface');
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [backendOnline]);

  const runningCount = agents.filter(a => a.status === 'Running' || a.status === 'Thinking').length;
  const idleCount = agents.filter(a => a.status === 'Idle' || a.status === 'Ready').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Backend status banner */}
      {backendOnline === false && (
        <div className="glass-card rounded-lg p-4 border border-error/30 bg-error/5 flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">wifi_off</span>
          <div>
            <p className="font-label text-label-md text-error font-semibold">Backend Offline — Demo Mode</p>
            <p className="text-sm text-on-surface-variant mt-1">Start the backend to see live telemetry: <code className="font-mono text-primary text-xs">uv run python -m uvicorn backend.server:app --port 8000 --reload</code></p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-display text-headline-lg font-bold text-on-surface tracking-tight">Agent Telemetry Monitor</h2>
          <p className="font-body text-body-md text-on-surface-variant mt-1">Real-time supervision of AI workforce execution and resource allocation.</p>
        </div>
        <div className="flex gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-mono border flex items-center gap-1.5 ${backendOnline ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-outline border-outline/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-outline'}`}></span>
            {backendOnline === null ? 'Connecting...' : backendOnline ? 'Backend Online' : 'Backend Offline'}
          </span>
          <button suppressHydrationWarning onClick={fetchHealth} className="px-4 py-2 rounded-md bg-primary-container/20 border border-primary text-primary font-label text-label-md hover:bg-primary-container/40 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Global Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="font-label text-label-sm text-on-surface-variant tracking-wider uppercase">Active Swarm</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-headline-lg font-bold text-primary">{agentCount}</span>
              <span className="font-body text-sm text-on-surface-variant">/ {agentCount} online</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">device_hub</span>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="font-label text-label-sm text-on-surface-variant tracking-wider uppercase">Active Tasks</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-headline-lg font-bold text-secondary">{runningCount}</span>
              <span className="font-body text-sm text-on-surface-variant">running</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-2xl">memory</span>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="font-label text-label-sm text-on-surface-variant tracking-wider uppercase">Idle Agents</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-headline-lg font-bold text-on-surface">{idleCount}</span>
              <span className="font-body text-sm text-on-surface-variant">standby</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">sd_storage</span>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="z-10">
            <p className="font-label text-label-sm text-emerald-400 tracking-wider uppercase">Error Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-headline-lg font-bold text-emerald-400">0.0</span>
              <span className="font-body text-sm text-on-surface-variant">%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 z-10">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div>
        <h3 className="font-display text-headline-md font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">grid_view</span>
          Agent Topography
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>

      {/* Live Console */}
      <div>
        <div className="glass-card rounded-lg overflow-hidden flex flex-col border border-white/10">
          <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
              <span className="font-label text-label-sm tracking-wider uppercase text-on-surface-variant">Live Stdout Stream</span>
              {backendOnline && (
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">● LIVE</span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
              <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
              <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
            </div>
          </div>
          <div ref={consoleRef} className="bg-[#020617] h-80 p-4 font-mono text-sm overflow-y-auto custom-scrollbar leading-relaxed">
            {consoleLogs.map((log, i) => (
              <div key={i} className={log.msgColor}>
                <span className="text-outline">{log.time}</span>{' '}
                <span className={log.agentColor}>{log.agent}</span>{' '}
                {log.msg}
              </div>
            ))}
            <div className="text-on-surface mt-2 animate-pulse">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
