import React, { useEffect, useState } from 'react';
import './App.css';
import { FPSCounter } from './ui/FPSCounter';
import { useEngine } from './useEngine';

function App() {
  const engine = useEngine();
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

  return <div className="scene" ref={setRenderElt}>
    <FPSCounter />
  </div>;
}

export default App;
