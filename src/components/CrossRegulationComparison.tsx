import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRightLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function CrossRegulationComparison() {
  const [selectedRegs, setSelectedRegs] = useState<string[]>(["RBI", "SEC"]);

  const comparisonData = [
    {
      feature: "Breach Reporting",
      rbi: "Real-time (Immediate)",
      sec: "4 Business Days",
      eu: "72 Hours",
      status: "Conflict",
    },
    {
      feature: "Data Residency",
      rbi: "Local Only",
      sec: "Global (with disclosure)",
      eu: "EU-Sovereign",
      status: "Divergent",
    },
    {
      feature: "AI Transparency",
      rbi: "Guidelines Only",
      sec: "Risk-based Disclosure",
      eu: "Strict (AI Act)",
      status: "Aligned",
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ArrowRightLeft className="text-blue-500" size={20} />
            Cross-Jurisdictional Comparison Engine
          </CardTitle>
          <p className="text-xs text-zinc-500">Compare regulatory requirements across different regions to identify global compliance gaps.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-4 px-4 text-[10px] uppercase font-bold text-zinc-500">Requirement</th>
                  <th className="py-4 px-4 text-[10px] uppercase font-bold text-orange-500">RBI (India)</th>
                  <th className="py-4 px-4 text-[10px] uppercase font-bold text-blue-500">SEC (USA)</th>
                  <th className="py-4 px-4 text-[10px] uppercase font-bold text-purple-500">EU (Europe)</th>
                  <th className="py-4 px-4 text-[10px] uppercase font-bold text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-4 px-4 text-sm font-bold text-zinc-300">{row.feature}</td>
                    <td className="py-4 px-4 text-xs text-zinc-400">{row.rbi}</td>
                    <td className="py-4 px-4 text-xs text-zinc-400">{row.sec}</td>
                    <td className="py-4 px-4 text-xs text-zinc-400">{row.eu}</td>
                    <td className="py-4 px-4">
                      <Badge className={`text-[10px] ${
                        row.status === "Conflict" ? "bg-red-500/10 text-red-500" :
                        row.status === "Divergent" ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"
                      }`}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertCircle className="text-red-500" size={16} />
              Critical Conflict Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400 leading-relaxed">
              RBI mandates immediate breach reporting, while SEC allows 4 days. Your global incident response policy must default to the strictest requirement (RBI) to maintain global compliance.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={16} />
              Optimization Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Aligning your AI transparency reports with the EU AI Act will automatically satisfy the emerging disclosure requirements from both SEC and SEBI.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
