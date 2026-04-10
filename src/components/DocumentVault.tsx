import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Upload, Search, Shield, ArrowRight, Zap, Info, Lock } from "lucide-react";
import { motion } from "motion/react";

export function DocumentVault() {
  const [search, setSearch] = useState("");

  const documents = [
    { name: "Global Cybersecurity Policy v4.2", type: "Policy", lastUpdated: "2024-01-15", status: "Compliant", security: "Confidential" },
    { name: "Data Privacy & Residency Framework", type: "Framework", lastUpdated: "2023-11-20", status: "Review Required", security: "Restricted" },
    { name: "Third-Party Risk Management Standard", type: "Standard", lastUpdated: "2024-02-10", status: "Compliant", security: "Confidential" },
    { name: "Digital Payment Security Controls", type: "Controls", lastUpdated: "2024-03-05", status: "Draft", security: "Internal" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-500">
            <Database size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Knowledge</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Document Vault</h2>
          <p className="text-zinc-500 text-sm max-w-xl">
            Secure repository for internal policies, contracts, and frameworks. 
            AI-powered semantic search and automated gap analysis.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] h-12 px-8">
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Filters */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Search Vault</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-purple-500/50 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Categories</label>
            <div className="space-y-1">
              <CategoryItem label="All Documents" count={12} active />
              <CategoryItem label="Policies" count={4} />
              <CategoryItem label="Contracts" count={6} />
              <CategoryItem label="Frameworks" count={2} />
            </div>
          </div>

          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-purple-500">
                <Zap size={20} />
                <span className="text-xs font-black uppercase tracking-widest">AI Insight</span>
              </div>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Our engine has detected that 2 policies are out of sync with the latest SEC Cybersecurity mandates.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest h-10">
                Run Gap Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Document Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#0f0f11] border-zinc-800/50 hover:border-purple-500/30 transition-all group h-full flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-zinc-900 rounded-2xl group-hover:scale-110 transition-transform border border-zinc-800 text-purple-500">
                      <FileText size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-zinc-800 ${
                        doc.status === 'Compliant' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {doc.status}
                      </Badge>
                      <div className="p-1.5 bg-zinc-900 rounded-lg text-zinc-600">
                        <Lock size={12} />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-500 transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>Updated {doc.lastUpdated}</span>
                  </div>
                  <div className="mt-auto pt-6 border-t border-zinc-800/50 flex gap-3">
                    <Button variant="outline" className="flex-1 border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest h-10">
                      View
                    </Button>
                    <Button className="flex-1 bg-zinc-900 hover:bg-purple-600 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest h-10 border border-zinc-800 transition-all">
                      Analyze
                      <ArrowRight size={12} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ label, count, active }: { label: string, count: number, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active ? "bg-purple-600/10 text-purple-500" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
    }`}>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
        active ? "bg-purple-500 text-white" : "bg-zinc-800 text-zinc-600"
      }`}>
        {count}
      </span>
    </button>
  );
}
