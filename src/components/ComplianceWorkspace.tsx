import React, { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, updateDoc, doc } from "firebase/firestore";
import { ComplianceTask } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, AlertCircle, User, Briefcase, Plus, Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function ComplianceWorkspace() {
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("dueDate", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ComplianceTask));
      setTasks(data);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const filteredTasks = tasks.filter(t => filter === "all" || t.status === filter);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <CheckSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Excellence</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Compliance Workspace</h2>
          <p className="text-zinc-500 text-sm max-w-xl">
            Manage remediation tasks, assign responsibilities, and track global compliance progress.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] h-12 px-8">
            <Plus size={16} className="mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-800/50 pb-6">
        <FilterButton label="All Tasks" active={filter === "all"} onClick={() => setFilter("all")} count={tasks.length} />
        <FilterButton label="Pending" active={filter === "pending"} onClick={() => setFilter("pending")} count={tasks.filter(t => t.status === "pending").length} />
        <FilterButton label="In Progress" active={filter === "in_progress"} onClick={() => setFilter("in_progress")} count={tasks.filter(t => t.status === "in_progress").length} />
        <FilterButton label="Completed" active={filter === "completed"} onClick={() => setFilter("completed")} count={tasks.filter(t => t.status === "completed").length} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-[#0f0f11] border-zinc-800/50 hover:border-blue-500/30 transition-all group overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className={`uppercase tracking-widest text-[9px] font-black ${
                          task.priority === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                          task.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}>
                          {task.priority} Priority
                        </Badge>
                        <span className="text-[10px] font-mono text-zinc-600">REF: {task.circularId}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">{task.title}</h3>
                      <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span className="flex items-center gap-2">
                          <User size={12} className="text-zinc-600" />
                          {task.assignedTo}
                        </span>
                        <span className="flex items-center gap-2">
                          <Briefcase size={12} className="text-zinc-600" />
                          {task.department}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={12} className="text-zinc-600" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {task.status !== "completed" ? (
                        <Button 
                          onClick={() => handleStatusChange(task.id, "completed")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8"
                        >
                          Mark Complete
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] px-8 py-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                          <CheckSquare size={14} />
                          Completed
                        </div>
                      )}
                      <Button variant="outline" className="h-12 w-12 border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-white">
                        <AlertCircle size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-800">
              <CheckSquare size={32} />
            </div>
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No tasks found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all border ${
        active 
          ? "bg-blue-600/10 border-blue-500/30 text-blue-500" 
          : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
        active ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-500"
      }`}>
        {count}
      </span>
    </button>
  );
}
