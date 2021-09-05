import React, { FC, useEffect, useState } from 'react';
import { useEngine } from '../useEngine';
import './FPSCounter.css';

const SAMPLE_WINDOW_SIZE = 20;

/** Simple FPS counter */
export const FPSCounter: FC = () => {
  const engine = useEngine();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (engine) {
      let frameCount = 0;
      let totalTime = 0;
      return engine.update.subscribe((_, deltaTime) => {
        totalTime += deltaTime;
        // Set the FPS counter every N frames.
        if (++frameCount >= SAMPLE_WINDOW_SIZE) {
          setFps(SAMPLE_WINDOW_SIZE / totalTime);
          totalTime = 0;
          frameCount = 0;
        }
      });
    }
  }, [engine]);

  return <div className="fps-counter">fps: {fps.toFixed(1)}</div>;
};
