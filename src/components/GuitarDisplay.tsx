import React from 'react';
import { motion } from 'motion/react';
import { PitchData } from '../hooks/usePitchDetect';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export interface StringConfig {
  name: string;
  freq: number;
  stringNum: number;
}

interface GuitarDisplayProps {
  pitchData: PitchData | null;
  hapticEnabled: boolean;
  strings: StringConfig[];
}

export const GUITAR_STRINGS: StringConfig[] = [
  { name: 'E4', freq: 329.63, stringNum: 1 },
  { name: 'B3', freq: 246.94, stringNum: 2 },
  { name: 'G3', freq: 196.00, stringNum: 3 },
  { name: 'D3', freq: 146.83, stringNum: 4 },
  { name: 'A2', freq: 110.00, stringNum: 5 },
  { name: 'E2', freq: 82.41,  stringNum: 6 },
];

export const BASS_STRINGS: StringConfig[] = [
  { name: 'G2', freq: 98.00, stringNum: 1 },
  { name: 'D2', freq: 73.42, stringNum: 2 },
  { name: 'A1', freq: 55.00, stringNum: 3 },
  { name: 'E1', freq: 41.20, stringNum: 4 },
];

export const UKULELE_STRINGS: StringConfig[] = [
  { name: 'A4', freq: 440.00, stringNum: 1 },
  { name: 'E4', freq: 329.63, stringNum: 2 },
  { name: 'C4', freq: 261.63, stringNum: 3 },
  { name: 'G4', freq: 392.00, stringNum: 4 },
];

export function GuitarDisplay({ pitchData, hapticEnabled, strings }: GuitarDisplayProps) {
  let closestString = null;
  let cents = 0;

  if (pitchData && pitchData.isActive) {
    let minDiff = Infinity;
    for (const str of strings) {
      const diff = Math.abs(pitchData.frequency - str.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestString = str;
      }
    }
    if (closestString) {
      cents = 1200 * Math.log2(pitchData.frequency / closestString.freq);
    }
  }

  const isAccurate = Math.abs(cents) < 5 && !!closestString && !!pitchData?.isActive;

  useHapticFeedback(isAccurate, hapticEnabled);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full h-48 mb-8 flex items-end justify-center bg-gray-50 dark:bg-gray-900 rounded-t-3xl border-b-4 border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            <path d="M50 10 Q60 50 50 90 Q40 50 50 10" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative w-full flex justify-center mb-6">
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-gray-400 z-0" />
            {pitchData && pitchData.isActive && (
              <motion.div
                animate={{ left: `${50 + Math.max(-50, Math.min(50, cents))}%` }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-6 rounded-full shadow-md z-10 ${isAccurate ? 'bg-blue-500' : 'bg-gray-900 dark:bg-white'}`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-evenly w-full px-4 gap-2">
        {strings.map((str) => {
          const isCurrent = closestString?.name === str.name && pitchData?.isActive;
          return (
            <div key={str.name} className="flex flex-col items-center gap-4">
              <motion.div
                animate={isCurrent && isAccurate ? { scale: [1, 1.2, 1.1] } : { scale: isCurrent ? 1.1 : 1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all ${
                  isCurrent
                    ? isAccurate
                      ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-lg shadow-blue-500/20'
                      : 'border-gray-900 bg-gray-100 text-gray-900 dark:border-white dark:bg-gray-800 dark:text-white'
                    : 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600'
                }`}
              >
                {str.name[0]}
                <span className="text-xs opacity-50 ml-0.5">{str.name[1]}</span>
              </motion.div>
              <div className="w-1 h-32 bg-gray-200 dark:bg-gray-800 rounded-t-full relative overflow-hidden">
                {isCurrent && (
                  <motion.div
                    className={`absolute bottom-0 w-full ${isAccurate ? 'bg-blue-500' : 'bg-gray-400'}`}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center h-16">
        {pitchData && pitchData.isActive && closestString && (
          <>
            <div className="text-sm text-gray-500 mb-1">String {closestString.stringNum}</div>
            <div className={`text-2xl font-black tracking-tight ${isAccurate ? 'text-blue-500' : ''}`}>
              {Math.abs(cents).toFixed(1)} <span className="text-base font-normal">cents</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
