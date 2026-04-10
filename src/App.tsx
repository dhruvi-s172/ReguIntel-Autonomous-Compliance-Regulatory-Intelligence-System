import React, { useState, useEffect } from "react";
import { 
  auth, 
  login, 
  logout, 
  subscribeToAuth, 
  subscribeToCollection, 
  getDocument, 
  setDocument,
  where,
  orderBy,
  limit
} from "./lib/firebase";
import { User } from "firebase/auth";
import { Circular, ImpactAnalysis, AuditEntry, UserProfile } from "./types";
import { Dashboard } from "./components/Dashboard";
import { RegulatoryFeed } from "./components/RegulatoryFeed";
import { ImpactReport } from "./components/ImpactReport";
import { DraftingTool } from "./components/DraftingTool";
import { ChatInterface } from "./components/ChatInterface";
import { SimulationEngine } from "./components/SimulationEngine";
import { CrossRegulationComparison } from "./components/CrossRegulationComparison";
import { AlertSystem } from "./components/AlertSystem";
import { ComplianceWorkspace } from "./components/ComplianceWorkspace";
import { DocumentVault } from "./components/DocumentVault";
import { AuditTrail } from "./components/AuditTrail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  Shield, Bell, Search, Activity, FileText, MessageSquare, 
  Zap, Globe, Info, LogOut, User as UserIcon, 
  LayoutDashboard, Terminal, Cpu, History, CheckSquare, Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isScanning, setIsScanning] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener & Profile Sync
  useEffect(() => {
    const unsub = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync Profile
        const userProfile = await getDocument<UserProfile>("users", firebaseUser.uid);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Create default profile for new users
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "User",
            role: "viewer",
            createdAt: new Date() as any // serverTimestamp will be used in setDocument
          };
          await setDocument("users", firebaseUser.uid, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Real-time Data Subscriptions
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const unsubCirculars = subscribeToCollection<Circular>(
      "circulars", 
      setCirculars, 
      [orderBy("date", "desc"), limit(50)]
    );

    const unsubLogs = subscribeToCollection<AuditEntry>(
      "audit_logs", 
      setAuditLogs, 
      [orderBy("timestamp", "desc"), limit(20)]
    );

    return () => {
      unsubCirculars();
      unsubLogs();
    };
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Welcome to ReguIntel Enterprise");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    toast.info("Agents deployed to global regulatory endpoints...");
    try {
      const res = await fetch("/api/scan", { method: "POST" });
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      toast.error("Scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectCircular = async (circular: Circular) => {
    setSelectedCircular(circular);
    setActiveTab("analysis");
    toast.info(`Running deep impact analysis for ${circular.id}...`);
    try {
      const res = await fetch(`/api/impact/${circular.id}`);
      const data = await res.json();
      setImpactAnalysis(data);
    } catch (error) {
      toast.error("Analysis failed");
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Initializing Secure Environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-orange-500/30">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/legal-tech/1920/1080?blur=10')] bg-cover bg-center opacity-20" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full space-y-8 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-900/40">
              <Shield className="text-white w-12 h-12" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">ReguIntel <span className="text-orange-500">v3.0</span></h1>
            <p className="text-zinc-500 font-medium uppercase tracking-[0.3em] text-[10px]">Autonomous Global Compliance</p>
          </div>
          
          <Card className="bg-zinc-900/50 border-zinc-800 glass shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <p className="text-zinc-400 text-sm leading-relaxed">
                Access the world's most powerful regulatory intelligence platform. 
                Real-time monitoring, AI-driven impact analysis, and automated compliance workflows.
              </p>
              <Button 
                onClick={handleLogin}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white h-14 font-black uppercase tracking-widest text-xs"
              >
                Sign in with Enterprise ID
              </Button>
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                <span>v3.0.4-Stable</span>
                <span>ISO 27001 Certified</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30 flex">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-[#020202] border-r border-zinc-800 flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800 h-20">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-bold text-lg tracking-tight truncate">ReguIntel</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium truncate">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            icon={<Bell size={20} />} 
            label="Intelligence Feed" 
            active={activeTab === "feed"} 
            onClick={() => setActiveTab("feed")} 
            badge={circulars.filter(c => c.status === "New").length}
          />
          <NavItem 
            icon={<Zap size={20} />} 
            label="Simulation Lab" 
            active={activeTab === "simulation"} 
            onClick={() => setActiveTab("simulation")} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="Compliance Workspace" 
            active={activeTab === "workspace"} 
            onClick={() => setActiveTab("workspace")} 
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="Document Vault" 
            active={activeTab === "vault"} 
            onClick={() => setActiveTab("vault")} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Impact Engine" 
            active={activeTab === "analysis"} 
            onClick={() => setActiveTab("analysis")} 
            disabled={!selectedCircular}
          />
          <NavItem 
            icon={<FileText size={20} />} 
            label="Drafting Copilot" 
            active={activeTab === "drafting"} 
            onClick={() => setActiveTab("drafting")} 
            disabled={!impactAnalysis}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Legal AI Chat" 
            active={activeTab === "chat"} 
            onClick={() => setActiveTab("chat")} 
          />
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-4">
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" /> : <UserIcon size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user.displayName || 'User'}</p>
                <p className="text-[10px] text-zinc-500 truncate">{profile?.role || 'viewer'}</p>
              </div>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-3 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 border border-orange-600/30"
          >
            <Globe className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isScanning ? 'Scanning...' : 'Global Scan'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-zinc-800 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span>{activeTab}</span>
              {selectedCircular && (
                <>
                  <span className="text-zinc-800">/</span>
                  <span className="text-orange-500 font-mono">{selectedCircular.id}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <AlertSystem />
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider font-black text-zinc-400">System: Operational</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-blue-500" />
                <span className="text-[10px] uppercase tracking-wider font-black text-zinc-400">Agents: 12 Active</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Primary Viewport */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Dashboard circulars={circulars} onSelect={handleSelectCircular} />
                  </motion.div>
                )}
                {activeTab === "feed" && (
                  <motion.div key="feed" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <RegulatoryFeed circulars={circulars} onSelect={handleSelectCircular} />
                  </motion.div>
                )}
                {activeTab === "simulation" && (
                  <motion.div key="simulation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                    <SimulationEngine />
                    <CrossRegulationComparison />
                  </motion.div>
                )}
                {activeTab === "analysis" && selectedCircular && impactAnalysis && (
                  <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ImpactReport circular={selectedCircular} analysis={impactAnalysis} />
                  </motion.div>
                )}
                {activeTab === "drafting" && impactAnalysis && (
                  <motion.div key="drafting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <DraftingTool analysis={impactAnalysis} />
                  </motion.div>
                )}
                {activeTab === "chat" && (
                  <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ChatInterface />
                  </motion.div>
                )}
                {activeTab === "workspace" && (
                  <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ComplianceWorkspace />
                  </motion.div>
                )}
                {activeTab === "vault" && (
                  <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <DocumentVault />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Right Intelligence Panel (Desktop Only) */}
          <aside className="hidden xl:flex w-80 bg-[#020202] border-l border-zinc-800 flex-col shrink-0 p-4 space-y-6 overflow-y-auto">
            <AuditTrail logs={auditLogs} />
          </aside>
        </div>
      </div>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge, disabled }: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  badge?: number,
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-orange-600/10 text-orange-500 border border-orange-600/20" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"}`}>
          {icon}
        </span>
        <span className="text-sm font-bold lg:block hidden">{label}</span>
      </div>
      {badge ? (
        <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center lg:block hidden">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
