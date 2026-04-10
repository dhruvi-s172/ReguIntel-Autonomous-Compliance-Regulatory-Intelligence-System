import React, { useState } from "react";
import { Circular } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ExternalLink, ArrowRight, Clock, Activity, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";

export function RegulatoryFeed({ circulars, onSelect }: { circulars: Circular[], onSelect: (c: Circular) => void }) {
  const [search, setSearch] = useState("");

  const filtered = circulars.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.source.toLowerCase().includes(search.toLowerCase()) ||
    (c.region && c.region.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter text-white">Regulatory Intelligence Feed</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Global Monitoring • Real-time Updates</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <Input 
              placeholder="Search by ID, Title, Source, or Region..." 
              className="pl-12 bg-[#0f0f11] border-zinc-800 h-12 text-sm focus:ring-orange-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 border-zinc-800 bg-[#0f0f11] text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((circular, i) => (
          <motion.div
            key={circular.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className="bg-[#0f0f11] border-zinc-800/50 hover:border-orange-500/30 transition-all cursor-pointer group overflow-hidden glass"
              onClick={() => onSelect(circular)}
            >
              <div className="flex">
                <div className={`w-1.5 shrink-0 ${
                  circular.status === "New" ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "bg-zinc-800"
                }`} />
                <CardContent className="p-8 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-zinc-900 text-orange-500 border-zinc-800 font-black uppercase tracking-widest text-[9px] px-2 py-0.5">
                          {circular.source}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[9px]">
                          {circular.region}
                        </Badge>
                        <span className="text-[10px] font-mono text-zinc-600">{circular.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors leading-tight">
                        {circular.title}
                      </h3>
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span className="flex items-center gap-2">
                          <Clock size={12} className="text-zinc-600" />
                          Detected {circular.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Activity size={12} className="text-zinc-600" />
                          Risk: <span className={circular.riskScore && circular.riskScore > 70 ? 'text-red-500' : 'text-orange-500'}>
                            {circular.riskScore || "Pending"}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Shield size={12} className="text-zinc-600" />
                          {circular.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-zinc-500 hover:text-white hover:bg-zinc-900" 
                        onClick={(e) => { e.stopPropagation(); window.open(circular.url, '_blank'); }}
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button className="bg-zinc-900 hover:bg-orange-600 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 border border-zinc-800 transition-all">
                        Analyze Impact
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
