import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, Activity, Zap, Shield, 
  Search, FileText, TrendingUp, Wand2,
  Terminal, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Agent {
  id: string;
  name: string;
  status: 'Idle' | 'Processing' | 'Completed' | 'Error';
  task: string;
  icon: React.ReactNode;
  progress: number;
  color: string;
}

export function AgentMonitor() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "1", name: "Source Scraper", status: "Processing", task: "Monitoring RBI/SEC feeds", icon: <Search size={18} />, progress: 65, color: 'text-blue-500' },
    { id: "2", name: "Semantic Engine", status: "Idle", task: "Analyzing clause variations", icon: <FileText size={18} />, progress: 0, color: 'text-purple-500' },
    { id: "3", name: "Risk Predictor", status: "Idle", task: "Calculating causal impact", icon: <TrendingUp size={18} />, progress: 0, color: 'text-orange-500' },
    { id: "4", name: "Drafting Copilot", status: "Completed", task: "Policy update generated", icon: <Wand2 size={18} />, progress: 100, color: 'text-green-500' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (Math.random() > 0.8) {
          const statuses: Agent['status'][] = ["Processing", "Idle", "Completed"];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const newProgress = newStatus === 'Completed' ? 100 : newStatus === 'Processing' ? Math.floor(Math.random() * 90) : 0;
          return { ...agent, status: newStatus, progress: newProgress };
        }
        if (agent.status === 'Processing') {
          const nextProgress = Math.min(agent.progress + Math.floor(Math.random() * 5), 99);
          return { ...agent, progress: nextProgress };
        }
        return agent;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tighter text-white">Multi-Agent <span className="text-orange-500">Orchestration</span></h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Real-time Autonomous System Status</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 glass">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Healthy</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-500">Latency: 42ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-[#0f0f11] border-zinc-800/50 hover:border-zinc-700 transition-all group glass">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 bg-zinc-900 rounded-xl ${agent.color} group-hover:scale-110 transition-transform`}>
                  {agent.icon}
                </div>
                <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-none px-2 py-0.5 ${
                  agent.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                  agent.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {agent.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-tight">{agent.name}</h3>
                <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-widest">
                  {agent.task}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <span>Progress</span>
                  <span>{agent.progress}%</span>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    className={`h-full ${
                      agent.status === 'Processing' ? 'bg-blue-500' :
                      agent.status === 'Completed' ? 'bg-green-500' :
                      'bg-zinc-800'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-zinc-700" />
                  <span className="text-[9px] font-mono text-zinc-600">v2.1.0-stable</span>
                </div>
                <button className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                  View Logs
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#0f0f11] border-zinc-800/50 glass overflow-hidden">
        <CardHeader className="p-6 border-b border-zinc-800/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <Activity size={14} className="text-orange-500" />
            System Event Stream
          </CardTitle>
          <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest">
            Live Feed
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-900 font-mono text-[11px]">
            <EventRow time="18:57:12" agent="Scraper" event="New circular detected: RBI/2024/15" type="info" />
            <EventRow time="18:57:05" agent="Risk" event="Recalculating global risk trajectory..." type="warning" />
            <EventRow time="18:56:42" agent="Draft" event="Successfully pushed amendment to Document Vault" type="success" />
            <EventRow time="18:56:10" agent="System" event="Knowledge Graph re-indexed (4,201 nodes)" type="info" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventRow({ time, agent, event, type }: { time: string, agent: string, event: string, type: 'info' | 'success' | 'warning' | 'error' }) {
  const colors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-orange-500',
    error: 'text-red-500'
  };

  return (
    <div className="flex items-center gap-6 p-4 hover:bg-zinc-900/30 transition-colors group">
      <span className="text-zinc-600 w-20 shrink-0">{time}</span>
      <span className="text-zinc-400 w-24 shrink-0 font-bold uppercase tracking-widest text-[9px]">{agent}</span>
      <span className="text-zinc-300 flex-1">{event}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${colors[type].replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
    </div>
  );
}
