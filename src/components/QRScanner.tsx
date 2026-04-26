import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Info } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onResult }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true
          },
          /* verbose= */ false
        );

        scanner.render((decodedText) => {
          onResult(decodedText);
          scanner.clear().then(() => {
            scannerRef.current = null;
            onClose();
          });
        }, (errorMessage) => {
          // Silent errors during scanning are normal
        });

        scannerRef.current = scanner;
      }, 500);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
        scannerRef.current = null;
      }
    };
  }, [isOpen, onResult, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150]"
          />
          
          {/* Permanent Close button for accessibility */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="fixed top-8 right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white z-[170] border border-white/20 shadow-2xl transition-all active:scale-90"
            aria-label="Close Scanner"
          >
            <X size={28} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-brand-primary border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-[160] max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-2xl">
                    <QrCode size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-white italic">Table Access</h2>
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Scan to unlock your journey</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square bg-black/40 rounded-3xl overflow-hidden border border-white/5 shadow-inner">
                <div id="qr-reader" className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none border-[30px] border-brand-primary/40" />
                <div className="absolute inset-x-[15%] top-[15%] bottom-[15%] border-2 border-accent/60 rounded-2xl animate-pulse" />
              </div>

              <div className="flex items-start gap-3 p-5 bg-white/5 rounded-2xl border border-white/5 shadow-sm">
                <Info size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">How it works</p>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    Locate the gold-embossed QR code on your table stand. Scan it to instantly sync your reservation and access the digital sommelier.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 hover:text-white transition-all border border-white/5 active:scale-[0.98]"
              >
                Cancel Scanning
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
