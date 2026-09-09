import { useState, useEffect, useRef } from 'react';
import { getNoteInfo, yin } from '../lib/audio';

export interface PitchData {
  frequency: number;
  noteName: string;
  cents: number;
  octave: number;
  noteNum: number;
  isActive: boolean;
}

export function usePitchDetect(active: boolean) {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reqFrameRef = useRef<number>(0);

  useEffect(() => {
    if (active) {
      start();
    } else {
      stop();
    }
    return () => {
      stop();
    };
  }, [active]);

  const start = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      updatePitch();
    } catch (err: any) {
      console.error(err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        setError('Akses mikrofon ditolak. Pastikan Anda telah memberikan izin akses mikrofon pada peramban/browser Anda.');
      } else {
        setError(err.message || 'Gagal mengakses mikrofon.');
      }
    }
  };

  const stop = () => {
    if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setPitchData(null);
  };

  const updatePitch = () => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);

    if (rms > 0.01) {
      const freq = yin(buffer, audioCtxRef.current.sampleRate);
      if (freq !== -1 && freq > 20 && freq < 4000) {
        const info = getNoteInfo(freq);
        setPitchData({
          frequency: freq,
          noteName: info.noteName,
          cents: info.cents,
          octave: info.octave,
          noteNum: info.noteNum,
          isActive: true
        });
      } else {
        setPitchData(prev => prev ? { ...prev, isActive: false } : null);
      }
    } else {
      setPitchData(prev => prev ? { ...prev, isActive: false } : null);
    }
    
    reqFrameRef.current = requestAnimationFrame(updatePitch);
  };

  return { pitchData, error };
}
