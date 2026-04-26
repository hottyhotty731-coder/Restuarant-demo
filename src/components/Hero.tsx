import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour >= 5 && hour < 12) greeting = "Good Morning";
  else if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  else if (hour >= 18 && hour < 22) greeting = "Good Evening";
  else greeting = "Good Night";

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-primary pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
          alt="Restaurant mood"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-brand-primary" />
      </motion.div>

      <div className="relative z-10 text-center space-y-12 px-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[1em] text-accent/60 font-medium">
              {greeting}
            </span>
            <div className="h-px w-12 bg-accent/20" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] uppercase tracking-[0.8em] text-accent font-black"
          >
            FINE DINING EXPERIENCE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
            className="text-6xl sm:text-7xl md:text-[10rem] font-serif text-white tracking-widest leading-none"
          >
            RESTAURANT DEMO
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="max-w-xl mx-auto space-y-8"
        >
          <p className="text-sm md:text-lg text-stone-300 font-light leading-relaxed tracking-widest italic opacity-60">
            An extraordinary voyage through the ephemeral, where every plate tells a story of heritage and minimalist innovation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#reserve"
              className="px-12 py-5 bg-accent text-brand-primary text-[11px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-white transition-all shadow-2xl shadow-accent/20"
            >
              Book Now
            </motion.a>
            <a
              href="#menu"
              className="px-8 py-3 text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold hover:text-white transition-colors"
            >
              Explore Menu
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-2 pt-12 text-stone-500"
        >
          <ChevronDown size={24} className="animate-bounce" />
        </motion.div>
      </div>

      <div className="absolute left-8 bottom-12 hidden lg:flex flex-col gap-4 text-[9px] uppercase tracking-[0.6em] text-stone-600 font-bold vertical-text">
        <span>Paris • London • Tokyo • Dubai</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}} />
    </section>
  );
};
