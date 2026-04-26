import React from 'react';
import { motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';

export const PanoramaView: React.FC = () => {
  return (
    <section id="panorama" className="relative h-[80vh] w-full overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=2000" 
          alt="Restaurant Horizon View" 
          className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-transparent to-brand-primary" />
      </motion.div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-accent/50" />
            <Maximize2 size={16} className="text-accent" />
            <div className="h-px w-8 bg-accent/50" />
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-tighter leading-none">
            The Infinite <br />Perspective
          </h2>
          <p className="text-lg md:text-xl text-stone-300 font-light tracking-wide max-w-2xl mx-auto italic">
            "A framed horizon where the Mediterranean merges with the sky, providing a canvas for our culinary artistry."
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        <span className="text-[8px] uppercase tracking-[0.5em] text-accent/60 font-bold">Scroll to Explore</span>
      </div>
    </section>
  );
};
