import React, { useEffect, useState } from 'react';
import { Engine } from './Engine';
import './App.css';

function App() {
  const [engine] = useState(() => new Engine());
  const [renderElt, setRenderElt] = useState<HTMLElement | null>(null);

  useEffect(() => {
    engine.dispose();
  }, [engine]);

  useEffect(() => {
    if (renderElt) {
      engine.attach(renderElt);
      return () => engine.detach();
    }
  }, [renderElt, engine]);

  return (
    <div className="scene" ref={setRenderElt}>
    </div>
  );
}

export default App;
