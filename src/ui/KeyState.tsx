import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

/** Flags for which keys are held down. */
export interface KeyState {
  turnLeft?: boolean;
  turnRight?: boolean;
}

const KeyStateContext = createContext<KeyState>({});

export const KeyStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [keys] = useState<KeyState>(() => ({}));

  // Quick and dirty key handler. More advanced handlers will be table-driven.
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': {
          keys.turnRight = true;
          e.preventDefault();
          e.stopPropagation();
          break;
        }
        case 'ArrowLeft': {
          keys.turnLeft = true;
          e.preventDefault();
          e.stopPropagation();
          break;
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': {
          keys.turnRight = false;
          e.preventDefault();
          e.stopPropagation();
          break;
        }
        case 'ArrowLeft': {
          keys.turnLeft = false;
          e.preventDefault();
          e.stopPropagation();
          break;
        }
      }
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keys]);

  return <KeyStateContext.Provider value={keys}>{children}</KeyStateContext.Provider>;
};

export const useKeyState = () => useContext(KeyStateContext);
