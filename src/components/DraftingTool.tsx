import React, { useState } from "react";
import { ImpactAnalysis, Draft } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Gavel, CheckCircle, Download, Copy, RotateCcw, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function DraftingTool({ analysis }: { analysis: ImpactAnalysis }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);

  const handleGenerateDrafts = async () => {
    setIsDrafting(true);
    toast.info("AI Legal Copilot is drafting amendments...");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis })
      });
      const data = await res.json();
      setDrafts(data);
      toast.success("Drafting complete.");
    } catch (error) {
      toast.error("Drafting failed");
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <Gavel size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Legal Copilot</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Automated Remediation Drafting</h2>
          <p className="text-zinc-500 text-sm max-w-xl">
            AI-generated amendments for policies, contracts, and internal controls based on the latest regulatory impact analysis.
          </p>
        </div>
        <Button 
          onClick={handleGenerateDrafts}
          disabled={isDrafting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8"
        >
          {isDrafting ? "Drafting..." : "Generate Amendments"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {drafts.map((draft, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#0f0f11] border-zinc-800/50 hover:border-emerald-500/30 transition-all group overflow-hidden h-full flex flex-col">
                <CardHeader className="p-8 border-b border-zinc-800/50 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-2xl text-emerald-500 border border-zinc-800">
                      <FileText size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-white">{draft.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-[9px] font-black uppercase tracking-widest border-zinc-800 text-zinc-500">
                        {draft.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
                      <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
                      <Download size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Legal Justification
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      "{draft.justification}"
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {draft.content}
                  </div>

                  <div className="pt-6 border-t border-zinc-800/50 flex gap-4">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest h-10">
                      Approve & Deploy
                    </Button>
                    <Button variant="outline" className="flex-1 border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest h-10">
                      Request Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {drafts.length === 0 && !isDrafting && (
          <div className="lg:col-span-2 py-20 text-center space-y-4 border-2 border-dashed border-zinc-800/50 rounded-3xl">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-800">
              <Zap size={32} />
            </div>
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No drafts generated yet. Run analysis first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
