import React from 'react';
import { motion } from 'motion/react';
import { PitchData } from '../hooks/usePitchDetect';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface HarmonicaDisplayProps {
  pitchData: PitchData | null;
  hapticEnabled: boolean;
}

const HARMONICA_NOTES = [
  { hole: 1, type: 'blow', name: 'C4', freq: 261.63 },
  { hole: 1, type: 'draw', name: 'D4', freq: 293.66 },
  { hole: 2, type: 'blow', name: 'E4', freq: 329.63 },
  { hole: 2, type: 'draw', name: 'G4', freq: 392.00 },
  { hole: 3, type: 'blow', name: 'G4', freq: 392.00 },
  { hole: 3, type: 'draw', name: 'B4', freq: 493.88 },
  { hole: 4, type: 'blow', name: 'C5', freq: 523.25 },
  { hole: 4, type: 'draw', name: 'D5', freq: 587.33 },
  { hole: 5, type: 'blow', name: 'E5', freq: 659.25 },
  { hole: 5, type: 'draw', name: 'F5', freq: 698.46 },
  { hole: 6, type: 'blow', name: 'G5', freq: 783.99 },
  { hole: 6, type: 'draw', name: 'A5', freq: 880.00 },
  { hole: 7, type: 'blow', name: 'C6', freq: 1046.50 },
  { hole: 7, type: 'draw', name: 'B5', freq: 987.77 },
  { hole: 8, type: 'blow', name: 'E6', freq: 1318.51 },
  { hole: 8, type: 'draw', name: 'D6', freq: 1174.66 },
  { hole: 9, type: 'blow', name: 'G6', freq: 1567.98 },
  { hole: 9, type: 'draw', name: 'F6', freq: 1396.91 },
  { hole: 10, type: 'blow', name: 'C7', freq: 2093.00 },
  { hole: 10, type: 'draw', name: 'A6', freq: 1760.00 },
];

export function HarmonicaDisplay({ pitchData, hapticEnabled }: HarmonicaDisplayProps) {
  let closestNote = null;
  let cents = 0;

  if (pitchData && pitchData.isActive) {
    let minDiff = Infinity;
    for (const note of HARMONICA_NOTES) {
      const diff = Math.abs(pitchData.frequency - note.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    }
    if (closestNote) {
      cents = 1200 * Math.log2(pitchData.frequency / closestNote.freq);
    }
  }

  const isAccurate = Math.abs(cents) < 5 && !!closestNote && !!pitchData?.isActive;

  useHapticFeedback(isAccurate, hapticEnabled);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto overflow-x-auto pb-4">
      <div className="flex justify-center items-center mb-8 w-full max-w-sm">
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-gray-400 z-0" />
          {pitchData && pitchData.isActive && (
            <motion.div
              animate={{ left: `${50 + Math.max(-50, Math.min(50, cents))}%` }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-8 rounded-full shadow-md z-10 ${isAccurate ? 'bg-blue-500' : 'bg-gray-900 dark:bg-white'}`}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-inner">
        {Array.from({ length: 10 }).map((_, i) => {
          const holeNum = i + 1;
          const blowNote = HARMONICA_NOTES.find(n => n.hole === holeNum && n.type === 'blow');
          const drawNote = HARMONICA_NOTES.find(n => n.hole === holeNum && n.type === 'draw');
          
          const isBlowActive = closestNote?.hole === holeNum && closestNote?.type === 'blow' && pitchData?.isActive;
          const isDrawActive = closestNote?.hole === holeNum && closestNote?.type === 'draw' && pitchData?.isActive;

          return (
            <div key={holeNum} className="flex flex-col items-center gap-2">
              <div className={`text-xs font-bold w-10 text-center py-1 rounded transition-colors ${isBlowActive ? (isAccurate ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white dark:bg-white dark:text-black') : 'text-gray-500'}`}>
                {blowNote?.name.replace(/[0-9]/g, '')}
              </div>
              
              <motion.div 
                animate={(isBlowActive || isDrawActive) && isAccurate ? { scale: [1, 1.15, 1.1] } : { scale: (isBlowActive || isDrawActive) ? 1.1 : 1 }}
                className={`w-10 h-10 rounded border-2 flex items-center justify-center font-black text-lg transition-all ${
                isBlowActive || isDrawActive
                  ? isAccurate ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-600 shadow-lg' : 'border-gray-900 bg-white dark:bg-black dark:border-white text-gray-900 dark:text-white'
                  : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400'
              }`}>
                {holeNum}
              </motion.div>

              <div className={`text-xs font-bold w-10 text-center py-1 rounded transition-colors ${isDrawActive ? (isAccurate ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white dark:bg-white dark:text-black') : 'text-gray-500'}`}>
                {drawNote?.name.replace(/[0-9]/g, '')}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-between w-full max-w-sm px-4 text-sm font-medium text-gray-500">
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-sm"></span> Blow</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-sm"></span> Draw</div>
      </div>
    </div>
  );
}
