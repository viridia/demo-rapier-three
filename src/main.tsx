import './index.css';
import { createApp } from './createApp';
import type { Engine } from './Engine';

let engine: Engine | null = null;

document.addEventListener('DOMContentLoaded', () => {
  engine = createApp();
});

// Handle hot reloading of the engine.
if (import.meta.hot) {
  import.meta.hot.accept('./createApp', ({ createApp }) => {
    console.log('hot');
    if (engine) {
      engine.detach();
      engine.dispose();
    }
    engine = createApp();
  });
}
