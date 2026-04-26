import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, Users, CheckCircle2, AlertCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reservation } from '../types';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfToday,
  eachDayOfInterval
} from 'date-fns';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onAddReservation: (data: Omit<Reservation, 'id'>) => void;
  onCancelReservation: (id: string) => void;
}

const MAX_CAPACITY = 3;

export const ReservationModal: React.FC<ReservationModalProps> = ({ 
  isOpen, 
  onClose, 
  reservations, 
  onAddReservation, 
  onCancelReservation 
}) => {
  const [step, setStep] = useState<'form' | 'success' | 'list'>('form');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:00',
    guests: '2 Guests',
    tableNumber: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isFinalConfirmed, setIsFinalConfirmed] = useState(false);

  const checkAvailability = (date: string, time: string) => {
    const existingBookings = reservations.filter(r => r.date === date && r.time === time);
    return existingBookings.length < MAX_CAPACITY;
  };

  const isFullyBooked = (date: string) => {
    const timeSlots = ['19:00', '19:30', '20:00', '20:30', '21:00'];
    return timeSlots.every(slot => !checkAvailability(date, slot));
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.date) {
      setError('Please select a date.');
      return;
    }

    if (!checkAvailability(formData.date, formData.time)) {
      setError('This time slot is fully booked. Please select another time or date.');
      return;
    }

    const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    onAddReservation({
      ...formData,
      confirmationCode
    });
    setIsFinalConfirmed(false);
    setStep('success');
  };

  const handleConfirmCancel = (id: string) => {
    onCancelReservation(id);
    setCancellingId(null);
  };

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const renderCalendar = () => {
    const today = startOfToday();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-serif text-white italic">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/5 rounded-lg text-stone-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/5 rounded-lg text-stone-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-[8px] uppercase tracking-widest text-stone-600 font-bold text-center py-2">
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = formData.date === dateStr;
            const isToday = isSameDay(day, today);
            const isPast = isBefore(day, today) && !isToday;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const full = isFullyBooked(dateStr);
            
            return (
              <button
                key={idx}
                disabled={isPast}
                onClick={() => setFormData({ ...formData, date: dateStr })}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-xl text-[10px] transition-all
                  ${!isCurrentMonth ? 'opacity-20' : ''}
                  ${isPast ? 'cursor-not-allowed opacity-10' : 'hover:bg-white/5 cursor-pointer'}
                  ${isSelected ? 'bg-accent !text-brand-primary font-bold shadow-lg shadow-accent/20 scale-105 z-10' : 'text-stone-300'}
                  ${full && !isSelected ? 'border border-red-500/30' : ''}
                `}
              >
                {format(day, 'd')}
                {full && isCurrentMonth && !isSelected && (
                  <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />
                )}
                {isToday && !isSelected && (
                  <div className="absolute bottom-1.5 w-1 h-1 bg-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {formData.date && (
          <div className="text-[10px] text-center text-stone-500">
            Selected: <span className="text-accent font-bold uppercase tracking-widest">{format(new Date(formData.date), 'EEEE, MMMM do')}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg frosted-glass p-8 md:p-12 rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setStep(step === 'list' ? 'form' : 'list')}
                className="text-[10px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors"
              >
                {step === 'list' ? '← Back to Form' : `Your Bookings (${reservations.length})`}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-stone-400"
              >
                <X size={20} />
              </button>
            </div>

            {step === 'form' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-serif text-white italic">Réservez Votre Table</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">An Intimate Experience</p>
                </div>

                <form onSubmit={handleReserve} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1 flex items-center gap-2">
                        <CalendarIcon size={12} className="text-accent" />
                        Select Date
                      </label>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                        {renderCalendar()}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                          <select 
                            required 
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/40 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option className="bg-stone-900" value="19:00">19:00</option>
                            <option className="bg-stone-900" value="19:30">19:30</option>
                            <option className="bg-stone-900" value="20:00">20:00</option>
                            <option className="bg-stone-900" value="20:30">20:30</option>
                            <option className="bg-stone-900" value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                      <select 
                        required 
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/40 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option className="bg-stone-900" value="2 Guests">2 Guests</option>
                        <option className="bg-stone-900" value="3 Guests">3 Guests</option>
                        <option className="bg-stone-900" value="4 Guests">4 Guests</option>
                        <option className="bg-stone-900" value="Private Dining (6+)">Private Dining (6+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1 flex items-center justify-between">
                      <span>Table Number (Optional)</span>
                      <span className="text-[8px] text-stone-600">If already seated</span>
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 12"
                      value={formData.tableNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d+$/.test(val)) {
                          setFormData({ ...formData, tableNumber: val });
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-accent/40 outline-none transition-all"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed"
                      >
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="w-full bg-accent text-brand-primary py-4 rounded-xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-xl shadow-accent/10"
                  >
                    Confirm Reservation
                  </button>
                </form>
              </div>
            )}

            {step === 'list' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-serif text-white italic">Vos Réservations</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">Manage Your Journey</p>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {reservations.length === 0 ? (
                    <div className="py-12 text-center opacity-30 italic">
                      No upcoming reservations found.
                    </div>
                  ) : (
                    reservations.map((res) => (
                      <motion.div
                        key={res.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group relative overflow-hidden"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={12} className="text-accent" />
                            <p className="text-xs text-white font-medium">{res.date}</p>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-1"><Clock size={10} /> {res.time}</span>
                            <span className="flex items-center gap-1"><Users size={10} /> {res.guests}</span>
                            {res.tableNumber && <span className="text-accent/60">Table: {res.tableNumber}</span>}
                          </div>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-stone-600 font-black mt-1">Code: {res.confirmationCode}</p>
                        </div>

                        <AnimatePresence>
                          {cancellingId === res.id ? (
                            <motion.div 
                              initial={{ x: '100%' }}
                              animate={{ x: 0 }}
                              exit={{ x: '100%' }}
                              className="absolute inset-y-0 right-0 p-4 bg-red-500/90 backdrop-blur-md flex items-center gap-3"
                            >
                              <p className="text-[9px] uppercase tracking-widest font-black text-white shrink-0">Cancel?</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleConfirmCancel(res.id)}
                                  className="w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                                >
                                  OK
                                </button>
                                <button 
                                  onClick={() => setCancellingId(null)}
                                  className="w-7 h-7 bg-black/20 text-white rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => setCancellingId(res.id)}
                              className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                              title="Cancel Reservation"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-6 py-8"
              >
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-brand-primary shadow-2xl shadow-accent/20">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-white italic">Confirmé</h3>
                  <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
                    Your table is secured for {formData.date} at {formData.time}. A confirmation concierge will be in touch shortly.
                  </p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-stone-500 font-bold mb-1">Confirmation Code</p>
                    <p className="text-2xl font-mono text-accent tracking-tighter">
                      {reservations[reservations.length - 1]?.confirmationCode}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <AnimatePresence>
                    {isFinalConfirmed ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-[10px] uppercase tracking-widest font-bold"
                      >
                        ✓ Final Confirmation Received. See you soon.
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setIsFinalConfirmed(true)}
                        className="w-full py-4 bg-white text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-xl"
                      >
                        Final Confirm
                      </button>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('list')}
                      className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                      View All
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-accent text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
