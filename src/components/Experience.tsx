import React from 'react';
import { motion } from 'motion/react';
import { Camera, MapPin, Wind } from 'lucide-react';

const ViewCard = ({ image, title, description, delay }: { image: string, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-[32px] aspect-[4/5] md:aspect-[3/4]"
  >
    <img 
      src={image} 
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent p-8 flex flex-col justify-end gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <h4 className="text-2xl font-serif text-white">{title}</h4>
      <p className="text-xs text-stone-400 uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
        {description}
      </p>
    </div>
  </motion.div>
);

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-32 px-6 max-w-7xl mx-auto space-y-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-px bg-accent" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Atmosphere</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">
            The World Beyond <br />The Plate
          </h2>
          <p className="text-stone-400 font-light leading-relaxed tracking-wide">
            For those joining us from afar, glimpse into the sanctuary we've built. A multisensory environment where architecture meets the horizon, designed to elevate every moment of your culinary discovery.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
            <Camera size={20} className="text-accent" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-300">Panoramic Views</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
            <Wind size={20} className="text-accent" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-300">Open Air Terrace</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ViewCard 
          image="https://images.unsplash.com/photo-1544124499-58d343602100?auto=format&fit=crop&q=80&w=1000"
          title="The Zenith Terrace"
          description="A minimalist sanctuary carved into the cliffside."
          delay={0.1}
        />
        <ViewCard 
          image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
          title="Inner Sanctum"
          description="Warm stone and curated silence."
          delay={0.2}
        />
        <ViewCard 
          image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1000"
          title="Twilight Salon"
          description="Where the city lights meet the stars."
          delay={0.3}
        />
      </div>

      <div className="relative frosted-glass rounded-[40px] p-12 md:p-20 overflow-hidden flex flex-col items-center text-center gap-8">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1466973313258-a53c39199b64?auto=format&fit=crop&q=80&w=2000" 
            alt="bg" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={16} className="text-accent" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">In-Restaurant Experience</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif">Arrived?</h3>
          <p className="text-stone-400 max-w-lg mx-auto font-light italic">
            "If you are currently with us, scan the QR code at your table or proceed directly to our digital carte below to curate your selection."
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-6"
          >
            <a 
              href="#menu"
              className="px-12 py-4 bg-white text-brand-primary rounded-full text-[10px] uppercase tracking-[0.4em] font-black hover:bg-accent transition-colors block md:inline-block"
            >
              Order from Table
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
