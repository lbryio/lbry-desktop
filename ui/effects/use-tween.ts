//@ts-nocheck
import { useEffect, useState } from "react";

const getProgress = (elapsed: unknown, duration: unknown) => Math.min(elapsed / duration, 1);
const easeOut = (progress: unknown) => Math.pow(progress - 1, 5) + 1;

export default function useTween(duration: unknown, onRest: unknown) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let elapsed = 0;
    let frame;

    const tick = (now: unknown) => {
      elapsed = now - start;
      const progress = getProgress(elapsed, duration);
      setValue(easeOut(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onRest && onRest();
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [duration, onRest]);

  return value;
}
