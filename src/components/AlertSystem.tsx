import { useState, useEffect } from "react";
import { Bell, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AlertSystem() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-orange-600/20 border border-orange-600/30 rounded-lg px-4 py-2 flex items-center gap-4"
        >
          <div className="flex items-center gap-2 text-orange-500">
            <AlertCircle size={16} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Critical Deadline</span>
          </div>
          <div className="h-4 w-px bg-orange-600/30" />
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-zinc-400" />
            <span className="text-xs font-mono font-bold text-zinc-200">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            className="text-zinc-500 hover:text-zinc-300 text-[10px] font-bold uppercase"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
