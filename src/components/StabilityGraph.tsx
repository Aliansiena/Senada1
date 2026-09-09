import React, { useEffect, useRef } from 'react';
import { PitchData } from '../hooks/usePitchDetect';

interface StabilityGraphProps {
  pitchData: PitchData | null;
  isActive: boolean;
}

type HistoryPoint = { cents: number; active: boolean };

export function StabilityGraph({ pitchData, isActive }: StabilityGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<HistoryPoint[]>(Array(100).fill({ cents: 0, active: false }));
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const draw = () => {
      historyRef.current.shift();
      historyRef.current.push({
        cents: pitchData && pitchData.isActive ? Math.max(-50, Math.min(50, pitchData.cents)) : 0,
        active: !!(pitchData && pitchData.isActive)
      });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Garis tengah (0 cents)
      ctx.strokeStyle = '#9ca3af'; // gray-400
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Batas toleransi +5 dan -5 cents
      ctx.strokeStyle = '#e5e7eb'; // light gray
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 - (5 / 50) * (canvas.height / 2 * 0.8));
      ctx.lineTo(canvas.width, canvas.height / 2 - (5 / 50) * (canvas.height / 2 * 0.8));
      ctx.moveTo(0, canvas.height / 2 - (-5 / 50) * (canvas.height / 2 * 0.8));
      ctx.lineTo(canvas.width, canvas.height / 2 - (-5 / 50) * (canvas.height / 2 * 0.8));
      ctx.stroke();

      if (isActive) {
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const step = canvas.width / (historyRef.current.length - 1);
        let isDrawing = false;
        
        for (let i = 0; i < historyRef.current.length; i++) {
          const pt = historyRef.current[i];
          if (!pt.active) {
            if (isDrawing) {
              ctx.stroke();
              isDrawing = false;
            }
            continue;
          }

          if (i === 0) continue;
          const prevPt = historyRef.current[i - 1];
          if (!prevPt.active) continue;

          const isAccurate = Math.abs(pt.cents) < 5;
          const x1 = (i - 1) * step;
          const y1 = canvas.height / 2 - (prevPt.cents / 50) * (canvas.height / 2 * 0.8);
          const x2 = i * step;
          const y2 = canvas.height / 2 - (pt.cents / 50) * (canvas.height / 2 * 0.8);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          // Warna biru terang jika akurat, abu-abu jika tidak
          ctx.strokeStyle = isAccurate ? '#3b82f6' : '#6b7280';
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [pitchData, isActive]);

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Stabilitas Nada</span>
      <div className="w-full max-w-md h-20 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden relative shadow-inner">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={80} 
          className="w-full h-full"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-[1px]">
            <span className="text-sm font-medium text-gray-400">Mikrofon Mati</span>
          </div>
        )}
      </div>
    </div>
  );
}
