import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Play, AlertTriangle, ShieldCheck, 
  TrendingUp, Cpu, Globe, ArrowRight, Activity, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function SimulationEngine() {
  const [scenario, setScenario] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setIsSimulating(true);
    toast.info("Running regulatory 'What-If' simulation...");
    
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario })
      });
      const data = await res.json();
      setResult(data);
      toast.success("Simulation complete");
    } catch (error) {
      toast.error("Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-600 text-white border-none font-black uppercase tracking-widest text-[10px] px-3 py-1">
              Predictive Engine Active
            </Badge>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Mode: Monte Carlo Simulation</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">
            Regulatory <span className="text-orange-500">What-If</span> Lab
          </h2>
          <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed">
            Simulate the impact of hypothetical regulatory changes on your global business infrastructure before they become law.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Simulation Input */}
        <Card className="bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="p-8 border-b border-zinc-800/50">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Cpu size={14} className="text-orange-500" />
              Scenario Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Define Scenario</p>
              <textarea 
                placeholder="e.g., What if the EU mandates local data storage for all financial transactions within 30 days?" 
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:ring-orange-500/50 text-zinc-300 resize-none"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Confidence Threshold</p>
              <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-xs font-bold text-zinc-400">95% (Standard)</span>
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            </div>

            <Button 
              onClick={handleSimulate}
              disabled={isSimulating || !scenario.trim()}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white h-14 font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-900/40"
            >
              {isSimulating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play size={16} fill="currentColor" />
                  Execute Simulation
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        <Card className="lg:col-span-2 bg-[#0f0f11] border-zinc-800/50 glass flex flex-col min-h-[500px]">
          <CardHeader className="p-8 border-b border-zinc-800/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Activity size={14} className="text-blue-500" />
              Simulation Output
            </CardTitle>
            {result && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                Success
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0 flex-1 relative">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 space-y-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Impact Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-black tracking-tighter text-orange-500">{result.score || result.impactScore}</span>
                          <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">/ 100</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Affected Entities</p>
                        <div className="flex flex-wrap gap-2">
                          {(result.affectedEntities || ['Infrastructure', 'Legal', 'Operations']).map((entity: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-400 text-[10px] font-bold px-3 py-1">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-6">
                      <div className="flex items-center gap-3 text-blue-500">
                        <ShieldCheck size={24} />
                        <span className="text-xs font-black uppercase tracking-widest">Mitigation Strategy</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {result.mitigation || result.mitigationStrategy}
                      </p>
                      <Button variant="outline" className="w-full border-zinc-800 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest h-10">
                        Apply Strategy
                        <ArrowRight size={12} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-10"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                    <Zap size={32} className="text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500 mb-2">No Simulation Data</h3>
                  <p className="text-sm text-zinc-600 max-w-xs">
                    Enter a regulatory scenario and click "Execute Simulation" to visualize potential impacts.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SimulationCard 
          icon={<Globe className="text-blue-500" />} 
          title="Global Drift" 
          desc="Analyze how regulatory divergence between US and EU affects your architecture."
        />
        <SimulationCard 
          icon={<AlertTriangle className="text-amber-500" />} 
          title="Penalty Forecast" 
          desc="Predict potential fines based on historical enforcement patterns."
        />
        <SimulationCard 
          icon={<Info className="text-purple-500" />} 
          title="Scope Expansion" 
          desc="Simulate what happens if your product is re-classified under new AI Act rules."
        />
      </div>
    </div>
  );
}

function SimulationCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="bg-[#0f0f11] border-zinc-800/50 hover:border-orange-500/30 transition-all cursor-pointer group glass">
      <CardContent className="p-6 space-y-4">
        <div className="p-3 bg-zinc-900 rounded-xl w-fit group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
