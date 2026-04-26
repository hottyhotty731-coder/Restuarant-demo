import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, ShoppingBag, ArrowRight, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { Order, Reservation } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  reservations: Reservation[];
  onRepeatOrder: (order: Order) => void;
  onCancelReservation: (id: string) => void;
}

interface OrderItemProps {
  order: Order;
  onRepeat: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onRepeat }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleRepeatClick = () => {
    if (showConfirm) {
      onRepeat();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4 hover:border-accent/30 transition-all group"
    >
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest text-accent font-black">Order #{order.id.slice(0, 8)}</p>
            {order.tableNumber && (
              <span className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-stone-400 font-bold tracking-widest uppercase">
                Table {order.tableNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500">{new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-accent">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-stone-300">
            {item.quantity}x {item.name}
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="text-[10px] text-stone-500 pt-1 ml-1">
            +{order.items.length - 3} more
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4 pt-4 border-t border-white/5"
          >
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex gap-3 items-center">
                    <span className="text-accent font-mono w-4">{item.quantity}x</span>
                    <span className="text-stone-300">{item.name}</span>
                  </div>
                  <span className="text-stone-500">${(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-between text-[10px] uppercase tracking-widest text-stone-500 font-bold border-t border-white/5">
              <span>Service Included</span>
              <span>10%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-white transition-colors"
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {showConfirm ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4"
              >
                <p className="text-[9px] uppercase tracking-widest font-black text-stone-500 text-right">
                  Add back to cart?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-[9px] uppercase tracking-widest font-black text-stone-500 hover:text-white transition-colors px-2 py-1"
                  >
                    No
                  </button>
                  <button
                    onClick={handleRepeatClick}
                    className="text-[9px] uppercase tracking-widest font-black bg-accent text-brand-primary px-4 py-1.5 rounded-full hover:bg-white transition-all shadow-lg shadow-accent/20"
                  >
                    Yes
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="repeat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleRepeatClick}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-2 hover:text-white transition-colors"
              >
                Repeat Journey <ArrowRight size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ReservationItem: React.FC<{ 
  reservation: Reservation; 
  onCancel: () => void;
}> = ({ reservation, onCancel }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4 hover:border-accent/30 transition-all group relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            <p className="text-xs text-white font-medium">{reservation.date}</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-stone-500 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1"><Clock size={10} /> {reservation.time}</span>
            <span className="flex items-center gap-1"><Users size={10} /> {reservation.guests}</span>
            {reservation.tableNumber && <span className="text-accent/60">Table: {reservation.tableNumber}</span>}
          </div>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <p className="text-[8px] uppercase tracking-[0.2em] text-stone-600 font-black">
        Confirmation Code: {reservation.confirmationCode}
      </p>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-primary/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <p className="text-sm text-white font-serif italic mb-4">Are you sure you want to cancel this reservation?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                No
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Yes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  orders, 
  reservations, 
  onRepeatOrder,
  onCancelReservation
}) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'reservations'>('orders');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl frosted-glass h-[75vh] flex flex-col rounded-[32px] overflow-hidden"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/20 rounded-full text-accent">
                  <History size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-white tracking-tight">Vivre à Nouveau</h2>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Your Culinary Journey</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-stone-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex border-b border-white/10 bg-black/20">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${
                  activeTab === 'orders' ? 'text-accent' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                Journeys ({orders.length})
                {activeTab === 'orders' && (
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${
                  activeTab === 'reservations' ? 'text-accent' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                Reservations ({reservations.length})
                {activeTab === 'reservations' && (
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
              {activeTab === 'orders' ? (
                orders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40 py-20">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="italic text-lg text-white text-center">No journeys found.<br/><span className="text-sm not-italic opacity-60">Begin your first voyage at the counter.</span></p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <OrderItem 
                      key={order.id} 
                      order={order} 
                      onRepeat={() => {
                        onRepeatOrder(order);
                        onClose();
                      }}
                    />
                  ))
                )
              ) : (
                reservations.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40 py-20">
                    <Calendar size={48} strokeWidth={1} />
                    <p className="italic text-lg text-white text-center">No reservations found.<br/><span className="text-sm not-italic opacity-60">Secure your table for the future.</span></p>
                  </div>
                ) : (
                  reservations.map((res) => (
                    <ReservationItem 
                      key={res.id} 
                      reservation={res} 
                      onCancel={() => onCancelReservation(res.id)} 
                    />
                  ))
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

