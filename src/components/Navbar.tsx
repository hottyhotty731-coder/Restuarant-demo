import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, History, Menu, QrCode } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenReserve: () => void;
  onOpenQR: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenOrders, onOpenReserve, onOpenQR, cartCount }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'panorama', 'experience', 'menu', 'reserve', 'philosophy'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Horizon', id: 'panorama' },
    { name: 'Atmosphere', id: 'experience' },
    { name: 'Carte', id: 'menu' },
    { name: 'Reserve', id: 'reserve' },
    { name: 'Philosophy', id: 'philosophy' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="frosted-glass backdrop-blur-2xl border-b border-white/5 py-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-12">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <a href="#" className="flex flex-col group py-2">
              <span className="text-lg md:text-2xl font-serif tracking-[0.2em] text-accent-soft group-hover:text-accent transition-colors leading-tight">
                RESTAURANT DEMO
              </span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-stone-500 group-hover:text-stone-300 transition-colors">
                Studio Culinaire
              </span>
            </a>
            <div className="hidden md:flex gap-10">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  className={`text-[10px] uppercase tracking-[0.4em] transition-all font-bold relative py-2 ${
                    activeSection === item.id ? 'text-accent' : 'text-stone-400 hover:text-accent'
                  }`}
                >
                  {item.name}
                  <AnimatePresence>
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeNav"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onOpenReserve}
              className="hidden md:flex px-6 py-2 bg-accent text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-accent/20 items-center justify-center whitespace-nowrap"
            >
              Book a Table
            </button>
            <button
              onClick={onOpenQR}
              className="p-2 md:p-3 bg-white/5 rounded-full border border-white/10 hover:border-accent/40 transition-all group"
              title="Scan Table QR"
            >
              <QrCode size={18} className="text-stone-300 group-hover:text-accent transition-colors" />
            </button>
            <button
              onClick={onOpenOrders}
              className="p-2 md:p-3 bg-white/5 rounded-full border border-white/10 hover:border-accent/40 transition-all group"
              title="Past Journeys"
            >
              <History size={18} className="text-stone-300 group-hover:text-accent transition-colors" />
            </button>
            <button
              id="cart-button"
              onClick={onOpenCart}
              className="relative group p-2 md:p-3 bg-white/5 rounded-full border border-white/10 hover:border-accent/40 transition-all"
            >
              <ShoppingBag size={18} className="text-stone-300 group-hover:text-accent transition-colors" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-accent text-brand-primary text-[8px] md:text-[10px] flex items-center justify-center rounded-full font-black border-2 border-brand-primary"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-brand-primary/95 backdrop-blur-3xl border-r border-white/5 h-full w-[85%] max-w-sm p-8 flex flex-col gap-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <a href="#" className="flex flex-col group">
                  <span className="text-xl font-serif tracking-[0.2em] text-accent">
                    RESTAURANT DEMO
                  </span>
                </a>
              </div>

              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl uppercase tracking-[0.4em] font-serif italic ${
                      activeSection === item.id ? 'text-accent' : 'text-stone-400'
                    }`}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  onOpenReserve();
                  setIsMobileMenuOpen(false);
                }}
                className="mt-4 px-6 py-4 bg-accent text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-accent/20"
              >
                Book a Table
              </motion.button>

              <button
                onClick={() => {
                  onOpenQR();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 text-stone-400 py-2 hover:text-accent transition-colors"
              >
                <QrCode size={20} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Scan Table QR</span>
              </button>
              
              <div className="mt-auto pt-10 space-y-8 border-t border-white/5 opacity-60">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Location</p>
                  <p className="text-xs text-stone-400">12 Place de la Concorde<br />75008 Paris, France</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Hours</p>
                  <p className="text-xs text-stone-400 italic font-medium">Daily: 19:00 — 23:00</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
