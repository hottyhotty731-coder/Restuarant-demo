import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, CreditCard, ChefHat, Bike, Check } from 'lucide-react';
import { CartItem } from '../types';

const ORDER_STATUSES = [
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Our chefs are crafting your selection with precision.' },
  { id: 'delivering', label: 'Out for Delivery', icon: Bike, description: 'Your culinary journey is en route to your location.' },
  { id: 'delivered', label: 'Delivered', icon: Check, description: 'Your selection has arrived. Bon appétit.' }
];

interface CartSidebarProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onCancelOrder: () => void;
  activeStage: number | null;
  onFinishOrder: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onCancelOrder,
  activeStage,
  onFinishOrder,
}) => {
  const isLiveStatus = activeStage !== null;
  const statusIndex = activeStage ?? 0;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    onCheckout();
  };

  const handleCancelOrder = () => {
    onCancelOrder();
  };

  const handleClose = () => {
    onClose();
  };

  const currentStatus = ORDER_STATUSES[statusIndex];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-primary/95 backdrop-blur-2xl border-l border-white/10 z-[60] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-serif text-white italic">
                    {isLiveStatus ? 'Live Journey' : 'La Sélection'}
                  </h2>
                  {!isLiveStatus && (
                    <span className="px-2 py-0.5 bg-accent text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                      {items.length} Items
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {isLiveStatus ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-12"
                    >
                      <div className="relative">
                        <motion.div 
                          key={currentStatus.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-2xl shadow-accent/20 relative z-10"
                        >
                          <currentStatus.icon size={32} className="text-brand-primary" />
                        </motion.div>
                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
                      </div>

                      <div className="space-y-6 w-full max-w-[280px]">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-serif text-white italic">{currentStatus.label}</h3>
                          <p className="text-sm text-stone-400 font-light leading-relaxed">
                            {currentStatus.description}
                          </p>
                        </div>

                        <div className="relative pt-4 pb-8">
                          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2" />
                          <div className="flex justify-between items-center relative z-10">
                            {ORDER_STATUSES.map((status, idx) => {
                              const Icon = status.icon;
                              const isCompleted = idx < statusIndex;
                              const isCurrent = idx === statusIndex;
                              return (
                                <div key={status.id} className="flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isCurrent ? 'bg-accent scale-110 shadow-lg shadow-accent/20' : 
                                    isCompleted ? 'bg-accent/40 scale-100' : 'bg-stone-800 scale-90'
                                  }`}>
                                    <Icon size={14} className={isCurrent ? 'text-brand-primary' : 'text-stone-400'} />
                                  </div>
                                  <span className={`text-[8px] uppercase tracking-widest font-black transition-colors ${
                                    isCurrent ? 'text-accent' : 'text-stone-600'
                                  }`}>
                                    {status.label.split(' ')[0]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-2">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Estimated Arrival</p>
                          <p className="text-xl font-serif text-white italic">
                            {statusIndex === 0 ? '30 — 45 Minutes' : 
                             statusIndex === 1 ? '15 — 20 Minutes' : 
                             'Enjoy your meal'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full max-w-[240px]">
                        {statusIndex === 0 && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleCancelOrder}
                            className="w-full py-3 border border-red-500/30 text-red-400 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                          >
                            Cancel Order
                          </motion.button>
                        )}
                        {statusIndex === 2 ? (
                           <button
                            onClick={onFinishOrder}
                            className="w-full py-3 bg-accent text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all"
                          >
                            Complete Journey
                          </button>
                        ) : (
                          <button
                            onClick={handleClose}
                            className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brand-primary transition-all"
                          >
                            Minimize Status
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 opacity-30 italic text-stone-400"
                    >
                      Your collection is currently empty
                    </motion.div>
                  ) : (
                    <motion.div
                      key="items"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-6 group">
                          <div className="w-24 h-24 bg-stone-900 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-white">{item.name}</span>
                              <span className="font-serif text-accent">${item.price * item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1 border border-white/5">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="p-1 text-stone-400 hover:text-accent transition-colors"
                                >
                                  <Minus size={14} strokeWidth={3} />
                                </button>
                                <span className="font-mono text-xs font-bold text-white min-w-[1rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="p-1 text-stone-400 hover:text-accent transition-colors"
                                >
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              </div>
                              <button
                                onClick={() => onRemove(item.id)}
                                className="text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-red-400 transition-colors font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isLiveStatus && (
                <div className="mt-auto pt-8 border-t border-white/10 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-stone-500 font-bold">
                      <span>Subtotal</span>
                      <span className="text-stone-300 font-mono">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs uppercase tracking-widest text-stone-500 font-bold">
                      <span>Service (10%)</span>
                      <span className="text-stone-300 font-mono">${(total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                      <span className="text-sm uppercase tracking-[0.3em] text-white">Grand Total</span>
                      <span className="text-4xl font-serif text-accent">${(total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckoutClick}
                    disabled={items.length === 0}
                    className="w-full bg-accent text-brand-primary py-5 rounded-2xl flex justify-between items-center px-8 hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-xl shadow-accent/10"
                  >
                    <span className="text-xs uppercase tracking-[0.3em] font-black">Finalize Voyage</span>
                    <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
