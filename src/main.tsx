import './index.css';
import { createApp } from './createApp';
import type { Engine } from './Engine';

let engine: Engine | null = null;

document.addEventListener('DOMContentLoaded', () => {
  engine = createApp();
});

// Handle hot reloading of the engine.
if (import.meta.hot) {
  import.meta.hot.accept('./createApp', module => {
    if (engine) {
      engine.detach();
      engine.dispose();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    engine = (module as any).createApp();
  });
}
