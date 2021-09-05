import React, { useEffect, useState } from 'react';
import { engineInstance } from './Engine';
import { useSignalValue } from './lib/Signal';
import './App.css';

function App() {
  const engine = useSignalValue(engineInstance);
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

  return <div className="scene" ref={setRenderElt}></div>;
}

// Handle hot reloading of the engine
if (import.meta.hot) {
  import.meta.hot.accept('./Engine', newEngine => {
    const { Engine } = newEngine;
    engineInstance.put(new Engine());
  });
}

export default App;
