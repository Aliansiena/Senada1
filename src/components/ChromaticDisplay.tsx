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
  
  let cents = 0;
  if (pitchData && pitchData.isActive) {
    cents = pitchData.cents;
  }

  // Calculate needle rotation based on cents (-50 to +50 -> -60deg to +60deg)
  const angle = (cents / 50) * 60;

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Gauge Arc */}
      <div className="relative w-64 h-32 overflow-hidden mb-4">
        {/* Arc Background */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[12px] border-gray-100 dark:border-gray-800" />
        
        {/* Tick marks */}
        {[-50, -25, 0, 25, 50].map((tick) => {
          const tickAngle = (tick / 50) * 60;
          return (
            <div
              key={tick}
              className="absolute bottom-0 left-1/2 w-0.5 h-64 origin-bottom -translate-x-1/2"
              style={{ transform: `rotate(${tickAngle}deg)` }}
            >
              <div className={`w-full h-4 ${tick === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
            </div>
          );
        })}

        {/* Needle */}
        {pitchData && pitchData.isActive && (
          <motion.div
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="absolute bottom-0 left-1/2 w-1.5 h-32 origin-bottom -translate-x-1/2 z-10"
          >
            <div className={`w-full h-full rounded-t-full ${isAccurate ? 'bg-blue-500' : 'bg-gray-900 dark:bg-white'}`} />
          </motion.div>
        )}
        
        {/* Center Cover */}
        <div className="absolute bottom-0 left-1/2 w-12 h-12 bg-white dark:bg-black rounded-t-full origin-bottom -translate-x-1/2 z-20" />
      </div>

      <div className="flex flex-col items-center justify-center mt-2 h-24">
        {pitchData && pitchData.isActive ? (
          <motion.div
            animate={isAccurate ? { scale: [1, 1.2, 1.1] } : { scale: 1 }}
            className={`text-6xl font-black tracking-tighter ${isAccurate ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}
          >
            {pitchData.noteName}
            <span className="text-2xl opacity-50">{pitchData.octave}</span>
          </motion.div>
        ) : (
          <div className="text-6xl font-black tracking-tighter text-gray-300 dark:text-gray-700">
            --
          </div>
        )}
        
        <div className={`text-lg font-bold mt-2 ${isAccurate ? 'text-blue-500' : 'text-gray-500'}`}>
          {pitchData && pitchData.isActive ? `${cents > 0 ? '+' : ''}${Math.round(cents)} cents` : 'Standby'}
        </div>
      </div>
    </div>
  );
}
