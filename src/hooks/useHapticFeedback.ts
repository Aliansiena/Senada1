import { useEffect, useRef } from 'react';

export function useHapticFeedback(isAccurate: boolean, enabled: boolean) {
  const prevAccurate = useRef(false);

  useEffect(() => {
    if (enabled && isAccurate && !prevAccurate.current) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
    prevAccurate.current = isAccurate;
  }, [isAccurate, enabled]);
}
