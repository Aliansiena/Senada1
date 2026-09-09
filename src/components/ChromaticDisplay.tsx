import React from 'react';
import { motion } from 'motion/react';
import { PitchData } from '../hooks/usePitchDetect';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface ChromaticDisplayProps {
  pitchData: PitchData | null;
  hapticEnabled: boolean;
}

const CLOCK_NOTES = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'
];

export function ChromaticDisplay({ pitchData, hapticEnabled }: ChromaticDisplayProps) {
  const isAccurate = pitchData ? Math.abs(pitchData.cents) < 5 : false;
  
  useHapticFeedback(isAccurate, hapticEnabled);
  
  let angle = 0;
  let currentNoteIndex = -1;

  if (pitchData && pitchData.isActive) {
    currentNoteIndex = CLOCK_NOTES.indexOf(pitchData.noteName);
    if (currentNoteIndex !== -1) {
      angle = (currentNoteIndex * 30) + (pitchData.cents / 100) * 30;
    }
  }

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-full border-4 border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-inner">
      {CLOCK_NOTES.map((note, index) => {
        const theta = (index * 30 - 90) * (Math.PI / 180);
        const radius = 100;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        
        const isCurrent = currentNoteIndex === index;

        return (
          <motion.div
            key={note}
            animate={isCurrent && isAccurate ? { scale: [1.1, 1.3, 1.25], opacity: [0.8, 1, 1] } : { scale: isCurrent ? 1.1 : 1, opacity: isCurrent ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className={`absolute font-bold text-lg sm:text-xl transition-colors duration-200 ${
              isCurrent
                ? isAccurate
                  ? 'text-blue-500 shadow-blue-500'
                  : 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-600'
            }`}
            style={{
              transform: `translate(${x}px, ${y}px)`
            }}
          >
            {note}
          </motion.div>
        );
      })}

      <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute w-1.5 h-[40%] origin-bottom rounded-full"
          style={{
            bottom: '50%',
            backgroundColor: pitchData?.isActive ? (isAccurate ? '#3b82f6' : '#9ca3af') : 'transparent'
          }}
        />
        <div className="absolute w-4 h-4 bg-gray-900 dark:bg-white rounded-full z-10" />
      </div>

      <div className="absolute bottom-8 text-center w-full flex flex-col items-center">
        <span className="text-3xl font-black tracking-tighter">
          {pitchData && pitchData.isActive ? pitchData.noteName : '--'}
        </span>
        <span className={`text-sm font-medium ${isAccurate ? 'text-blue-500' : 'text-gray-500'}`}>
          {pitchData && pitchData.isActive ? `${pitchData.cents > 0 ? '+' : ''}${pitchData.cents} cents` : ''}
        </span>
      </div>
    </div>
  );
}
