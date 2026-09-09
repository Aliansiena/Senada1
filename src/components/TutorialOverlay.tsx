import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Target, ArrowRightLeft, Palette } from 'lucide-react';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Cara Membaca Tuner</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Target className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Lingkaran Nada Kromatik</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Nada disusun melingkar seperti jam dinding. Saat Anda memainkan instrumen, huruf nada yang paling mendekati akan membesar dan menjadi fokus.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <ArrowRightLeft className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Jarum Penunjuk & Cents</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Jarum melambangkan posisi frekuensi Anda. Angka <strong>Cents</strong> menunjukkan deviasi. Nilai minus (-) berarti nada Anda terlalu rendah (flat), dan plus (+) berarti terlalu tinggi (sharp).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <Palette className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Indikator Warna Biru</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Apabila jarum dan huruf berubah warna menjadi <strong>Biru Terang</strong>, selamat! Artinya nada instrumen Anda sudah presisi dan akurat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  Mengerti, Mulai Tuning
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
