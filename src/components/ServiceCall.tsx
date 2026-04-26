import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Hand, HelpCircle, CheckCircle } from 'lucide-react';

export const ServiceCall: React.FC = () => {
  const [isCalled, setIsCalled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleCall = () => {
    setIsCalled(true);
    setShowOptions(false);
    setTimeout(() => setIsCalled(false), 5000);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col-reverse items-start gap-4">
      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOptions(!showOptions)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          showOptions ? 'bg-white text-brand-primary' : 'bg-brand-primary/80 backdrop-blur-md text-accent border border-white/10'
        }`}
      >
        <AnimatePresence mode="wait">
          {showOptions ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <HelpCircle size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bell"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <Bell size={24} />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-brand-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Options Panel */}
      <AnimatePresence>
        {showOptions && !isCalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: -20 }}
            className="frosted-glass p-6 rounded-3xl w-64 shadow-2xl border border-white/10 space-y-4"
          >
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold">Assistance</p>
              <h4 className="text-sm font-medium text-white uppercase tracking-tight">How may we serve you?</h4>
            </div>
            
            <div className="grid gap-2">
              <button 
                onClick={handleCall}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
              >
                <div className="p-2 bg-accent/20 rounded-lg text-accent group-hover:bg-accent group-hover:text-brand-primary transition-all">
                  <Hand size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-300">Call Attendant</span>
              </button>
              
              <button 
                onClick={handleCall}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
              >
                <div className="p-2 bg-stone-800 rounded-lg text-stone-400 group-hover:bg-white group-hover:text-brand-primary transition-all">
                  <HelpCircle size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-300">Request Menu Help</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {isCalled && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="frosted-glass p-4 rounded-2xl shadow-2xl border border-accent/20 flex items-center gap-4 w-64"
          >
            <div className="p-2 bg-accent rounded-full text-brand-primary">
              <CheckCircle size={16} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">Request Sent</p>
              <p className="text-[8px] text-stone-400 uppercase tracking-widest">Our staff is approaching.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
