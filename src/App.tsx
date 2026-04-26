import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PanoramaView } from './components/PanoramaView';
import { Experience } from './components/Experience';
import { MenuSection } from './components/MenuSection';
import { ServiceCall } from './components/ServiceCall';
import { CartSidebar } from './components/CartSidebar';
import { ReservationModal } from './components/ReservationModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { QRScanner } from './components/QRScanner';
import { MENU_ITEMS } from './constants';
import { CartItem, MenuItem, Order, Reservation } from './types';
import { CheckCircle2, ShoppingBag, Instagram, Facebook, Twitter } from 'lucide-react';

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [scannedTableNumber, setScannedTableNumber] = useState<string | null>(null);
  const [activeOrderStage, setActiveOrderStage] = useState<number | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  // Simulate order progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeOrderStage !== null && activeOrderStage < 2) {
      interval = setInterval(() => {
        setActiveOrderStage(prev => (prev !== null && prev < 2 ? prev + 1 : prev));
      }, 10000); // 10 seconds per stage
    }
    return () => clearInterval(interval);
  }, [activeOrderStage]);

  const addToCart = useCallback((item: MenuItem, sourceRect: DOMRect) => {
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
      const targetRect = cartButton.getBoundingClientRect();
      const newItem: FlyingItem = {
        id: Date.now(),
        x: sourceRect.left + sourceRect.width / 2,
        y: sourceRect.top + sourceRect.height / 2,
        targetX: targetRect.left + targetRect.width / 2,
        targetY: targetRect.top + targetRect.height / 2,
      };
      setFlyingItems(prev => [...prev, newItem]);
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(f => f.id !== newItem.id));
      }, 800);
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1; // Including 10% service
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      items: [...cart],
      total: total,
      tableNumber: scannedTableNumber || undefined
    };
    
    setOrders(prev => [newOrder, ...prev]);
    // setIsCartOpen(false);
    setCart([]);
    setActiveOrderStage(0);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 5000);
  };

  const handleCancelOrder = useCallback(() => {
    setOrders(prev => {
      const lastOrder = prev[0];
      if (lastOrder) {
        setCart(lastOrder.items);
        setActiveOrderStage(null);
        return prev.slice(1);
      }
      return prev;
    });
    setShowOrderSuccess(false);
  }, []);

  const handleRepeatOrder = useCallback((order: Order) => {
    setCart(order.items);
    setIsCartOpen(true);
  }, []);

  const handleAddReservation = (data: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const handleCancelReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const handleQRResult = useCallback((result: string) => {
    const cleanResult = result.trim().toLowerCase();
    
    if (cleanResult === 'menu') {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (cleanResult.startsWith('table:')) {
      const tableNum = cleanResult.split(':')[1];
      setScannedTableNumber(tableNum);
      // Maybe show a small notification or scroll to menu
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Check for reservation confirmation code
    const matchingRes = reservations.find(r => r.confirmationCode.toLowerCase() === cleanResult);
    if (matchingRes) {
      setIsReserveOpen(true);
      // The modal shows the reservations list by default, but we could highlight it
    }
  }, [reservations]);

  return (
    <div className="min-h-screen bg-brand-primary overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-stone-800/30 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenReserve={() => setIsReserveOpen(true)}
        onOpenQR={() => setIsQRScannerOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
      />

      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {flyingItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ 
                x: item.x - 12, 
                y: item.y - 12, 
                scale: 1,
                opacity: 1 
              }}
              animate={{ 
                x: item.targetX - 12, 
                y: item.targetY - 12, 
                scale: 0.2,
                opacity: 0.5 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="bg-accent text-brand-primary w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
            >
              <ShoppingBag size={12} strokeWidth={3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <main className="relative z-10">
        <div id="hero"><Hero /></div>
        <PanoramaView />
        <Experience />
        <MenuSection items={MENU_ITEMS} onAdd={addToCart} />

        <section id="reserve" className="py-32 px-6 max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-serif text-white italic">Reserve Your Table</h2>
          <p className="text-stone-400 font-light max-w-lg mx-auto leading-relaxed">
            Experience culinary excellence in an atmosphere of refined intimacy. We recommend booking at least two weeks in advance.
          </p>
          <button 
            onClick={() => setIsReserveOpen(true)}
            className="px-12 py-4 bg-accent text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-white transition-all shadow-xl shadow-accent/10"
          >
            Secure a Table
          </button>
        </section>

        <section id="philosophy" className="bg-white/5 backdrop-blur-md py-32 px-6 border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl md:text-5xl font-serif italic text-accent-soft">"A meal is not just food, it's a conversation between the chef and the soul."</h2>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">RESTAURANT DEMO CULINARY TEAM</p>
              <p className="text-xl font-serif text-white">Our Visionary Kitchen</p>
            </div>
          </div>
        </section>

        <footer className="py-20 px-6 bg-brand-primary border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl tracking-widest text-accent-soft">RESTAURANT DEMO</h3>
              <p className="text-sm text-stone-400 font-light leading-relaxed max-w-xs">
                Minimalism in form, maximalism in flavor. Dedicated to the art of the culinary experience.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-500">Location</h4>
              <p className="text-sm text-stone-400">12 Place de la Concorde<br />75008 Paris, France</p>
              <a 
                href="https://goo.gl/maps/R3f8XkY2bUj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-bold text-accent hover:text-white transition-colors"
              >
                <div className="p-1.5 rounded-full border border-accent/30 group-hover:border-white transition-colors">
                  <ShoppingBag size={10} className="rotate-[-45deg]" />
                </div>
                Open in Maps
              </a>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-500">Contact</h4>
              <p className="text-sm text-stone-400">reservations@restaurantdemo.com<br />+961 81 471 523</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-stone-500">Follow Us</h4>
              <div className="flex gap-4 pt-2">
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full border border-white/10 text-stone-400 hover:text-accent hover:border-accent transition-all">
                  <Instagram size={14} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full border border-white/10 text-stone-400 hover:text-accent hover:border-accent transition-all">
                  <Facebook size={14} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full border border-white/10 text-stone-400 hover:text-accent hover:border-accent transition-all">
                  <Twitter size={14} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        onCancelOrder={handleCancelOrder}
        activeStage={activeOrderStage}
        onFinishOrder={() => setActiveOrderStage(null)}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        reservations={reservations}
        onRepeatOrder={handleRepeatOrder}
        onCancelReservation={handleCancelReservation}
      />

      <ReservationModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        reservations={reservations}
        onAddReservation={handleAddReservation}
        onCancelReservation={handleCancelReservation}
      />

      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-8 right-8 frosted-glass p-6 shadow-2xl flex items-center gap-4 z-[100] rounded-2xl"
          >
            <div className="bg-accent p-2 rounded-full border border-brand-primary">
              <CheckCircle2 size={24} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">Order Sent to Kitchen</p>
              <p className="text-xs text-stone-400">Our chefs are preparing your journey.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onResult={handleQRResult}
      />

      <ServiceCall />
    </div>
  );
}
