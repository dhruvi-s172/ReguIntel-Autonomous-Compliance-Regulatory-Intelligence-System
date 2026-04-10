import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, Shield, Scale, 
  BookOpen, Zap, Cpu, ArrowRight, User as UserIcon,
  Terminal, Info, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "analysis" | "citation" | "recommendation";
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "ReguIntel Legal Copilot initialized. I have access to global regulatory databases and your internal compliance framework. How can I assist with your regulatory strategy today?",
      type: "analysis"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are an expert regulatory compliance assistant. Answer questions about RBI, SEBI, SEC, and EU regulations concisely and professionally. Focus on impact analysis and remediation steps."
        }
      });
      
      const assistantMsg: Message = { 
        role: "assistant", 
        content: response.text || "I couldn't process that request.",
        type: "recommendation"
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      toast.error("Error connecting to the intelligence engine.");
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to the intelligence engine." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 h-[calc(100vh-12rem)]">
      {/* Chat History & Context */}
      <div className="hidden lg:flex flex-col gap-8">
        <Card className="bg-[#0f0f11] border-zinc-800/50 glass">
          <CardHeader className="p-6 border-b border-zinc-800/50">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Cpu size={14} className="text-orange-500" />
              AI Context Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active Knowledge Bases</p>
              <div className="space-y-2">
                <ContextBadge label="RBI Master Directions" active />
                <ContextBadge label="SEC Cyber Rules" active />
                <ContextBadge label="EU AI Act (Final)" active />
                <ContextBadge label="Internal Policy v4.2" active />
              </div>
            </div>
            <div className="pt-6 border-t border-zinc-800/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Reasoning Mode</p>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <p className="text-xs font-bold text-zinc-400">Legal Precedent Analysis</p>
                <p className="text-[10px] text-zinc-600 mt-1">Cross-referencing global enforcement trends.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-600/10 border-orange-600/30 glass">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
              <Shield size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Secure Session</span>
            </div>
            <p className="text-[10px] text-orange-200/70 leading-relaxed uppercase tracking-wider font-bold">
              End-to-end encrypted. No data is used for model training.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <Card className="lg:col-span-3 bg-[#0f0f11] border-zinc-800/50 glass flex flex-col overflow-hidden">
        <CardHeader className="p-6 border-b border-zinc-800/50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Scale size={20} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black tracking-tight">Legal Intelligence Copilot</CardTitle>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Autonomous Reasoning Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-orange-500 animate-pulse" />
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-black uppercase tracking-widest">
              Gemini 3 Flash
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.role === "assistant" ? "bg-zinc-900 border-zinc-800 text-orange-500" : "bg-orange-600 border-orange-500 text-white"
                }`}>
                  {msg.role === "assistant" ? <Cpu size={20} /> : <UserIcon size={20} />}
                </div>
                <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`p-6 rounded-3xl text-sm leading-relaxed ${
                    msg.role === "assistant" 
                      ? "bg-zinc-900/50 border border-zinc-800 text-zinc-300" 
                      : "bg-orange-600 text-white font-medium"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.type && (
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      msg.role === "user" ? "justify-end" : ""
                    }`}>
                      <Info size={12} className="text-zinc-600" />
                      <span className="text-zinc-500">Classification:</span>
                      <span className="text-orange-500">{msg.type}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Cpu size={20} className="text-orange-500 animate-pulse" />
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <div className="p-6 border-t border-zinc-800/50 bg-zinc-950/50">
          <div className="relative flex items-center gap-4">
            <Input 
              placeholder="Ask about regulatory impacts, policy updates, or legal precedents..." 
              className="flex-1 bg-zinc-900 border-zinc-800 h-14 pl-6 pr-16 text-sm focus:ring-orange-500/50 rounded-2xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bg-orange-600 hover:bg-orange-500 text-white w-10 h-10 rounded-xl p-0 shadow-lg shadow-orange-900/20"
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <QuickAction label="Analyze RBI Mandate" onClick={() => setInput("Analyze the impact of the latest RBI Cyber Resilience mandate on our digital wallet.")} />
            <QuickAction label="Draft Privacy Update" onClick={() => setInput("Draft an update for our Privacy Policy based on the EU AI Act.")} />
            <QuickAction label="Risk Assessment" onClick={() => setInput("What is our current risk exposure for the USA region?")} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function ContextBadge({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
      active ? "bg-orange-600/5 border-orange-600/20" : "bg-zinc-950 border-zinc-800"
    }`}>
      <span className={`text-[10px] font-bold ${active ? "text-orange-500" : "text-zinc-600"}`}>{label}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-orange-500 animate-pulse" : "bg-zinc-800"}`} />
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-orange-500 transition-colors flex items-center gap-2"
    >
      <Zap size={10} />
      {label}
    </button>
  );
}
