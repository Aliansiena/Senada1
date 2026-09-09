import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Music, Guitar, Activity, Settings as SettingsIcon } from 'lucide-react';
import { usePitchDetect } from './hooks/usePitchDetect';
import { ChromaticDisplay } from './components/ChromaticDisplay';
import { GuitarDisplay, GUITAR_STRINGS, BASS_STRINGS, UKULELE_STRINGS } from './components/GuitarDisplay';
import { HarmonicaDisplay } from './components/HarmonicaDisplay';
import { InstallPWA } from './components/InstallPWA';
import { TutorialOverlay } from './components/TutorialOverlay';
import { SettingsModal } from './components/SettingsModal';
import { StabilityGraph } from './components/StabilityGraph';

type Mode = 'chromatic' | 'guitar' | 'bass' | 'ukulele' | 'harmonica';

export default function App() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<Mode>('chromatic');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  const { pitchData, error } = usePitchDetect(active);

  useEffect(() => {
    const savedHaptic = localStorage.getItem('hapticEnabled');
    if (savedHaptic !== null) {
      setHapticEnabled(savedHaptic === 'true');
    }
  }, []);

  const toggleHaptic = () => {
    setHapticEnabled(prev => {
      const next = !prev;
      localStorage.setItem('hapticEnabled', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (error) {
      setActive(false);
    }
  }, [error]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 pb-24">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
            <Music className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight">Senada</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        {error && (
          <div className="mb-6 w-full max-w-md p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-900/30 text-center">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col items-center">
          <div className="flex overflow-x-auto hide-scrollbar bg-gray-100 dark:bg-gray-900 p-1 rounded-full mb-8 shadow-inner w-full max-w-2xl px-1">
            <button
              onClick={() => setMode('chromatic')}
              className={`whitespace-nowrap flex-1 flex justify-center items-center gap-2 py-2.5 px-6 rounded-full text-sm font-bold transition-all ${mode === 'chromatic' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Activity className="w-4 h-4" /> Kromatik
            </button>
            <button
              onClick={() => setMode('guitar')}
              className={`whitespace-nowrap flex-1 flex justify-center items-center gap-2 py-2.5 px-6 rounded-full text-sm font-bold transition-all ${mode === 'guitar' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Guitar className="w-4 h-4" /> Gitar
            </button>
            <button
              onClick={() => setMode('bass')}
              className={`whitespace-nowrap flex-1 flex justify-center items-center gap-2 py-2.5 px-6 rounded-full text-sm font-bold transition-all ${mode === 'bass' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Guitar className="w-4 h-4" /> Bass
            </button>
            <button
              onClick={() => setMode('ukulele')}
              className={`whitespace-nowrap flex-1 flex justify-center items-center gap-2 py-2.5 px-6 rounded-full text-sm font-bold transition-all ${mode === 'ukulele' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Music className="w-4 h-4" /> Ukulele
            </button>
            <button
              onClick={() => setMode('harmonica')}
              className={`whitespace-nowrap flex-1 flex justify-center items-center gap-2 py-2.5 px-6 rounded-full text-sm font-bold transition-all ${mode === 'harmonica' ? 'bg-white dark:bg-black shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Music className="w-4 h-4" /> Harmonika
            </button>
          </div>

          <div className="w-full min-h-[350px] flex flex-col items-center justify-center relative">
            {mode === 'chromatic' && <ChromaticDisplay pitchData={pitchData} hapticEnabled={hapticEnabled} />}
            {mode === 'guitar' && <GuitarDisplay pitchData={pitchData} hapticEnabled={hapticEnabled} strings={GUITAR_STRINGS} />}
            {mode === 'bass' && <GuitarDisplay pitchData={pitchData} hapticEnabled={hapticEnabled} strings={BASS_STRINGS} />}
            {mode === 'ukulele' && <GuitarDisplay pitchData={pitchData} hapticEnabled={hapticEnabled} strings={UKULELE_STRINGS} />}
            {mode === 'harmonica' && <HarmonicaDisplay pitchData={pitchData} hapticEnabled={hapticEnabled} />}
          </div>

          <StabilityGraph pitchData={pitchData} isActive={active} />
          
          <div className="mt-8 w-full max-w-sm flex justify-between px-6 items-center">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Frekuensi</span>
              <span className="text-2xl font-black tracking-tighter">
                {pitchData?.isActive ? pitchData.frequency.toFixed(1) : '--'} <span className="text-sm font-medium text-gray-400">Hz</span>
              </span>
            </div>
            {active ? (
              <button 
                onClick={() => setActive(false)}
                className="w-14 h-14 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
              >
                <MicOff className="w-6 h-6" />
              </button>
            ) : (
              <button 
                onClick={() => setActive(true)}
                className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-transform animate-pulse"
              >
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </main>

      <InstallPWA />
      <TutorialOverlay isOpen={showTutorial} onClose={closeTutorial} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        hapticEnabled={hapticEnabled}
        toggleHaptic={toggleHaptic}
        openTutorial={() => setShowTutorial(true)}
      />
    </div>
  );
}
