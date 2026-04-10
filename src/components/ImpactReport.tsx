import React from "react";
import { Circular, ImpactAnalysis } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KnowledgeGraph } from "./KnowledgeGraph";
import { AlertTriangle, Shield, FileText, Zap, TrendingUp, Info, ArrowRight, Download, Users, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function ImpactReport({ circular, analysis }: { circular: Circular, analysis: ImpactAnalysis }) {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-zinc-800/50 pb-10">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-600/30 font-black uppercase tracking-widest text-[10px]">
              {circular.source} Intelligence
            </Badge>
            <span className="text-zinc-500 font-mono text-xs">{circular.id}</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white leading-none">
            {circular.title}
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
            {circular.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Risk Assessment</p>
            <div className={`text-5xl font-black tracking-tighter ${
              circular.riskScore && circular.riskScore > 70 ? 'text-red-500' : 'text-emerald-500'
            }`}>
              {circular.riskScore}%
            </div>
          </div>
          <Button className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6">
            <Download size={14} className="mr-2" />
            Export Briefing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: AI Reasoning */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" />
              Executive Intelligence Summary
            </h3>
            <div className="p-8 bg-[#0f0f11] border border-zinc-800/50 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16" />
              <p className="serif text-xl text-zinc-300 leading-relaxed italic">
                "{analysis.summary}"
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" />
              Causal Impact Chain
            </h3>
            <div className="h-[400px] bg-[#0f0f11] border border-zinc-800/50 rounded-3xl overflow-hidden">
              <KnowledgeGraph causalChain={analysis.causalChain} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <Info size={14} className="text-purple-500" />
              Predictive Compliance Insight
            </h3>
            <div className="p-8 bg-purple-500/5 border border-purple-500/20 rounded-3xl">
              <p className="text-sm text-purple-200 leading-relaxed font-medium">
                {analysis.predictiveInsight}
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Affected Entities */}
        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
              Affected Internal Assets
            </h3>
            <div className="space-y-4">
              {analysis.affectedEntities && analysis.affectedEntities.map((entity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-[#0f0f11] border border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-zinc-800 text-zinc-500">
                      {entity.type}
                    </Badge>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                      entity.impact === 'High' ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {entity.impact} Impact
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors">{entity.name}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{entity.reason}</p>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-zinc-800">
                    Assign Task
                    <ArrowRight size={12} className="ml-2" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

          <Card className="bg-emerald-600/10 border-emerald-600/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <Shield size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Compliance Guard</span>
              </div>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Our AI engine has identified critical alignment gaps. We recommend initiating the remediation workflow immediately.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest h-10">
                Start Remediation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
