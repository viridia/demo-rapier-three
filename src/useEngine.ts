import { engineInstance } from './Engine';
import { useSignalValue } from './lib';

export const useEngine = () => useSignalValue(engineInstance);

// Handle hot reloading of the engine. Currently this relies on React's update mechanism
// to handle unmounting and remounting of the engine. It would be possible to do this without
// React, but that is left as an exercise for the reader.
if (import.meta.hot) {
  import.meta.hot.accept('./Engine', newEngine => {
    const { Engine } = newEngine;
    engineInstance.get()?.dispose();
    engineInstance.set(new Engine());
  });
}
