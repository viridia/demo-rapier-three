import React, { useEffect, useState } from 'react';
import './App.css';
import { FPSCounter, useKeyState } from './ui';
import { useEngine } from './useEngine';

function App() {
  const engine = useEngine();
  const keys = useKeyState();

  // We use useState rather than useRef to hold the element reference, so that we can trigger
  // an update when the element gets set.
  const [renderElt, setRenderElt] = useState<HTMLElement | null>(null);

  // Dispose of the engine when this is unmounted, or when engine changes.
  useEffect(() => () => engine.dispose(), [engine]);

  // Attach the engine to the DOM, detach and re-attach when engine changes.
  useEffect(() => {
    if (renderElt && engine) {
      engine.attach(renderElt);
      return () => engine.detach();
    }
  }, [renderElt, engine]);

  // Update view in response to keyboard input
  useEffect(() => {
    return engine.update.subscribe((engine, deltaTime) => {
      const turnDir = (keys.turnLeft ? -1 : 0) + (keys.turnRight ? 1 : 0);
      engine.viewAngle += deltaTime * turnDir;
    });
  }, [engine.update, keys]);

  return (
    <div className="scene" ref={setRenderElt}>
      <FPSCounter />
    </div>
  );
}

export default App;
