import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CausalLink } from "../types";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
  impact?: 'High' | 'Medium' | 'Low';
}

export function KnowledgeGraph({ causalChain, onNodeClick }: { causalChain?: CausalLink[], onNodeClick?: (node: any) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;

    const defaultNodes: Node[] = [
      { id: "RBI-2024-001", group: 1, label: "RBI Master Direction" },
      { id: "SEC-2024-88", group: 1, label: "SEC Disclosure Rule" },
      { id: "Legal", group: 2, label: "Legal Dept" },
      { id: "IT", group: 2, label: "IT Dept" },
      { id: "Operations", group: 2, label: "Operations" },
      { id: "Digital Wallet", group: 3, label: "Digital Wallet" },
      { id: "Payment Gateway", group: 3, label: "Payment Gateway" },
      { id: "Privacy Policy", group: 4, label: "Privacy Policy" },
      { id: "Cyber Framework", group: 4, label: "Cyber Framework" },
    ];

    const defaultLinks: Link[] = [
      { source: "RBI-2024-001", target: "Legal", value: 5 },
      { source: "RBI-2024-001", target: "IT", value: 5 },
      { source: "SEC-2024-88", target: "Legal", value: 5 },
      { source: "Legal", target: "Privacy Policy", value: 2 },
      { source: "IT", target: "Cyber Framework", value: 2 },
      { source: "Operations", target: "Digital Wallet", value: 2 },
    ];

    // Merge causal chain if provided
    const nodes = [...defaultNodes];
    const links = [...defaultLinks];

    if (causalChain) {
      causalChain.forEach(link => {
        if (!nodes.find(n => n.id === link.from)) nodes.push({ id: link.from, group: 5, label: link.from });
        if (!nodes.find(n => n.id === link.to)) nodes.push({ id: link.to, group: 5, label: link.to });
        links.push({ source: link.from, target: link.to, value: 8, impact: link.impact });
      });
    }

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove();

    // Glow filter for ripple effect
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.impact === 'High' ? '#ef4444' : d.impact === 'Medium' ? '#f97316' : '#333')
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d.id);
        if (onNodeClick) onNodeClick(d);
        // Ripple effect animation
        d3.select(event.currentTarget).select("circle")
          .transition()
          .duration(500)
          .attr("r", 20)
          .transition()
          .duration(500)
          .attr("r", 10);
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", 10)
      .attr("fill", d => {
        if (d.group === 1) return "#f97316";
        if (d.group === 2) return "#3b82f6";
        if (d.group === 3) return "#a855f7";
        if (d.group === 5) return "#ef4444";
        return "#22c55e";
      })
      .attr("filter", d => selectedNode === d.id ? "url(#glow)" : null);

    node.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text(d => d.label)
      .attr("fill", "#71717a")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("class", "uppercase tracking-widest")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [causalChain, selectedNode, onNodeClick]);

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden glass">
      <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Dynamic Regulatory Impact Graph
          </CardTitle>
          <div className="flex gap-4 text-[10px] uppercase font-bold text-zinc-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Regulator</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Dept</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full" /> Product</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-[#050505]">
        <svg ref={svgRef} className="w-full h-[450px]" />
      </CardContent>
    </Card>
  );
}
