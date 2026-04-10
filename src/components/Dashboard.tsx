import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Circular } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Clock, Globe, TrendingUp, Zap, ArrowUpRight, Users, Briefcase, History } from "lucide-react";
import { motion } from "motion/react";

export function Dashboard({ circulars, onSelect }: { circulars: Circular[], onSelect: (c: Circular) => void }) {
  const stats = [
    { label: "Compliance Index", value: "98.4", icon: <Shield className="text-orange-500" />, trend: "+2.1%", color: "orange" },
    { label: "Risk Exposure", value: "Low", icon: <AlertTriangle className="text-amber-500" />, trend: "-14%", color: "amber" },
    { label: "Active Nodes", value: "1,242", icon: <Globe className="text-blue-500" />, trend: "Global", color: "blue" },
    { label: "Savings (Est)", value: "$2.4M", icon: <Zap className="text-purple-500" />, trend: "+$400k", color: "purple" },
  ];

  const riskData = [
    { name: "RBI", risk: 65, volume: 12 },
    { name: "SEBI", risk: 45, volume: 8 },
    { name: "SEC", risk: 85, volume: 15 },
    { name: "EU", risk: 92, volume: 20 },
    { name: "FCA", risk: 55, volume: 10 },
  ];

  const COLORS = ["#f97316", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-10">
      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[#0f0f11] border-zinc-800/50 hover:border-orange-500/30 transition-all group relative overflow-hidden glass">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-${stat.color}-500/10 transition-all`} />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-zinc-900 rounded-2xl group-hover:scale-110 transition-transform border border-zinc-800">
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={10} />
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-white">{stat.value}</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Intelligence Chart */}
        <Card className="lg:col-span-2 bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-zinc-800/50">
            <div>
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
                <TrendingUp size={20} className="text-orange-500" />
                Regulatory Risk Trajectory
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-1">Real-time risk assessment across global jurisdictions.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-zinc-800">Live</Badge>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-zinc-800">24H</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px", fontSize: "12px" }}
                  itemStyle={{ color: "#f97316" }}
                />
                <Area type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Departmental Impact */}
        <Card className="bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="p-8 border-b border-zinc-800/50">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
              <Users size={20} className="text-blue-500" />
              Impact by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <DepartmentItem label="Legal & Compliance" value={85} color="orange" />
            <DepartmentItem label="IT & Infrastructure" value={62} color="blue" />
            <DepartmentItem label="Operations" value={45} color="purple" />
            <DepartmentItem label="Finance" value={28} color="amber" />
            <div className="pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Global Readiness</span>
                <span className="text-xs font-bold text-orange-500">92%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Intelligence Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="p-8 border-b border-zinc-800/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
              <Briefcase size={20} className="text-zinc-400" />
              Critical Intelligence Stream
            </CardTitle>
            <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-zinc-800">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/50">
              {circulars.slice(0, 4).map((c, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-6 hover:bg-zinc-900/50 transition-all cursor-pointer group"
                  onClick={() => onSelect(c)}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-800 ${
                      c.riskScore && c.riskScore > 70 ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{c.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-zinc-800 text-zinc-500">{c.source}</Badge>
                        <span className="text-[10px] font-mono text-zinc-600">{c.id}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{c.region}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-400">{c.date}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                      c.riskScore && c.riskScore > 70 ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      Risk: {c.riskScore || "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health / Audit */}
        <Card className="bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="p-8 border-b border-zinc-800/50">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-3">
              <History size={20} className="text-zinc-500" />
              Recent Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <AuditItem action="Policy Updated" user="Legal Team" time="2m ago" />
              <AuditItem action="Scan Completed" user="System" time="15m ago" />
              <AuditItem action="Alert Triggered" user="Risk Engine" time="1h ago" />
              <AuditItem action="User Login" user="Admin" time="3h ago" />
            </div>
            <Button className="w-full mt-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-800">
              Full Audit Trail
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DepartmentItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
        <span>{label}</span>
        <span className={`text-${color}-500`}>{value}%</span>
      </div>
      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full bg-${color}-500`} />
      </div>
    </div>
  );
}

function AuditItem({ action, user, time }: { action: string, user: string, time: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
      <div className="flex-1">
        <p className="text-xs font-bold text-zinc-200">{action}</p>
        <p className="text-[10px] text-zinc-500 font-medium">{user} • {time}</p>
      </div>
    </div>
  );
}
