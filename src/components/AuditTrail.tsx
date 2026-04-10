import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { AuditLog } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, User, Cpu, Shield, 
  Terminal, Search, Filter, Download,
  Clock, ArrowRight, Info, AlertCircle, Lock, Activity
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AuditLog));
      setLogs(data);
    });
    return () => unsubscribe();
  }, []);

  // Mock logs if DB is empty for demo
  const displayLogs = logs.length > 0 ? logs : [
    { id: "LOG-001", userId: "admin@reguintel.com", action: "Policy Analysis Triggered", entityId: "SEC-2024-089", entityType: "Circular", timestamp: new Date().toISOString(), details: "Deep impact analysis initiated for SEC Cybersecurity disclosure rules." },
    { id: "LOG-002", userId: "legal_officer@reguintel.com", action: "Task Assigned", entityId: "TASK-442", entityType: "Task", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "Assigned 'Update Privacy Policy' to IT Department." },
    { id: "LOG-003", userId: "system", action: "Global Sync Completed", entityId: "SYS-SYNC", entityType: "System", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "Successfully synchronized data from RBI, SEC, and EU portals." },
    { id: "LOG-004", userId: "admin@reguintel.com", action: "User Role Updated", entityId: "USER-992", entityType: "User", timestamp: new Date(Date.now() - 10800000).toISOString(), details: "Changed role for user 'John Doe' from viewer to legal_officer." },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 font-black uppercase tracking-widest text-[10px] px-3 py-1">
              Immutable Ledger
            </Badge>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Hash: 0x8f2...3a1</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">
            System <span className="text-orange-500">Audit</span> Trail
          </h2>
          <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed">
            A comprehensive, tamper-proof record of all system actions, AI reasoning steps, and user interactions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest h-12 px-6">
            <Filter size={14} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest h-12 px-6">
            <Download size={14} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-[#0f0f11] border-zinc-800/50 glass overflow-hidden">
        <CardHeader className="p-0 border-b border-zinc-800/50">
          <div className="grid grid-cols-12 gap-4 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900/30">
            <div className="col-span-2 flex items-center gap-2">
              <Clock size={12} />
              Timestamp
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <User size={12} />
              Actor
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <Terminal size={12} />
              Action
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <Info size={12} />
              Details
            </div>
            <div className="col-span-1 text-right">
              Status
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-900">
            {displayLogs.map((log, i) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-12 gap-4 p-6 hover:bg-zinc-900/30 transition-colors group items-center"
              >
                <div className="col-span-2 font-mono text-[11px] text-zinc-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      log.userId === 'system' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                    }`}>
                      {log.userId === 'system' ? <Cpu size={12} /> : <User size={12} />}
                    </div>
                    <span className="text-xs font-bold text-zinc-300 truncate">{log.userId}</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{log.action}</span>
                </div>
                <div className="col-span-4">
                  <p className="text-xs text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">
                    {log.details}
                  </p>
                </div>
                <div className="col-span-1 text-right">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Events" value={displayLogs.length.toString()} icon={<Activity size={18} className="text-blue-500" />} />
        <StatCard title="AI Decisions" value="42" icon={<Cpu size={18} className="text-purple-500" />} />
        <StatCard title="Security Alerts" value="0" icon={<Shield size={18} className="text-green-500" />} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-[#0f0f11] border-zinc-800/50 glass">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{title}</p>
          <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
