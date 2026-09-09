import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Moon, Sun, Vibrate, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  hapticEnabled: boolean;
  toggleHaptic: () => void;
  a4Frequency: number;
  setA4Frequency: (freq: number) => void;
  openTutorial: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  hapticEnabled,
  toggleHaptic,
  a4Frequency,
  setA4Frequency,
  openTutorial
}: SettingsModalProps) {
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
            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Pengaturan</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <h3 className="font-bold text-sm">Tema Tampilan</h3>
                      <p className="text-xs text-gray-500">Gelap / Terang</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Vibrate className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-sm">Getaran (Haptic)</h3>
                      <p className="text-xs text-gray-500">Getar saat nada akurat</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleHaptic}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${hapticEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${hapticEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <div>
                        <h3 className="font-bold text-sm">Frekuensi A4 (Standar)</h3>
                        <p className="text-xs text-gray-500">Kalibrasi pitch dasar</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-blue-500">{a4Frequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="430"
                    max="450"
                    step="1"
                    value={a4Frequency}
                    onChange={(e) => setA4Frequency(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>430</span>
                    <span>440</span>
                    <span>450</span>
                  </div>
                </div>

                <button
                  onClick={() => { onClose(); openTutorial(); }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-bold text-sm">Buka Tutorial</h3>
                    <p className="text-xs text-gray-500">Lihat panduan penggunaan</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
