export const NOTES = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'
];

export function getNoteFromFrequency(frequency: number, a4Freq: number = 440): number {
  const noteNum = 12 * (Math.log(frequency / a4Freq) / Math.log(2));
  return Math.round(noteNum) + 69;
}

export function getFrequencyFromNote(note: number, a4Freq: number = 440): number {
  return a4Freq * Math.pow(2, (note - 69) / 12);
}

export function getCents(frequency: number, note: number, a4Freq: number = 440): number {
  return Math.floor(
    1200 * Math.log(frequency / getFrequencyFromNote(note, a4Freq)) / Math.log(2)
  );
}

export function getNoteInfo(frequency: number, a4Freq: number = 440) {
  const noteNum = getNoteFromFrequency(frequency, a4Freq);
  const cents = getCents(frequency, noteNum, a4Freq);
  const noteName = NOTES[noteNum % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  return { noteNum, noteName, cents, octave };
}

export function yin(buffer: Float32Array, sampleRate: number): number {
  const threshold = 0.15;
  const halfBufferSize = Math.floor(buffer.length / 2);
  const yinBuffer = new Float32Array(halfBufferSize);

  for (let t = 1; t < halfBufferSize; t++) {
    for (let i = 0; i < halfBufferSize; i++) {
      const delta = buffer[i] - buffer[i + t];
      yinBuffer[t] += delta * delta;
    }
  }

  let runningSum = 0;
  yinBuffer[0] = 1;
  for (let t = 1; t < halfBufferSize; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }

  let tau = -1;
  for (let t = 1; t < halfBufferSize; t++) {
    if (yinBuffer[t] < threshold) {
      while (t + 1 < halfBufferSize && yinBuffer[t + 1] < yinBuffer[t]) {
        t++;
      }
      tau = t;
      break;
    }
  }

  if (tau !== -1) {
    let betterTau = tau;
    if (tau > 0 && tau < halfBufferSize - 1) {
      const s0 = yinBuffer[tau - 1];
      const s1 = yinBuffer[tau];
      const s2 = yinBuffer[tau + 1];
      const adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0));
      if (Math.abs(adjustment) < 1) {
        betterTau += adjustment;
      }
    }
    return sampleRate / betterTau;
  }
  return -1;
}
