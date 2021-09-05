import { useEffect, useState } from 'react';

type Observer<T> = (data: T) => void;

/** Implementation of classic observer pattern. Contains a datum which will signal
    observers whenever the value changes. Note that it uses a shallow comparison to determine
    if a change has occurred.
 */
export class Signal<T> {
  private observers?: Set<Observer<T>>;

  constructor(private value: T) {}

  /** Get the current value of the signal. */
  public get(): T {
    return this.value;
  }

  /** Update the value of the signal. */
  public set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      if (this.observers) {
        this.observers.forEach(obs => obs(newValue));
      }
    }
  }

  /** Listen for changes to the value of the signal.
      @param observer Callback to be called when the signal value changes.
      @returns An unsubscribe callback.
  */
  public observe(observer: Observer<T>): () => void {
    if (!this.observers) {
      this.observers = new Set();
    }
    this.observers.add(observer);
    return () => this.unobserve(observer);
  }

  /** Stop listening for changes. */
  public unobserve(observer: Observer<T>): void {
    if (this.observers) {
      this.observers.delete(observer);
    }
  }
}

/** React hook function which returns the value of a signal, and also triggers an re-render
    whenever the signal changes value.
    @param signal The signal we want to listen to.
    @returns The current value of the signal.
*/
export function useSignalValue<T>(signal: Signal<T>): T {
  // Simple way to force a re-render, just set a new empty object every time.
  const [, setChanged] = useState({});

  useEffect(() => {
    return signal.observe(() => setChanged({}));
  }, [signal]);

  return signal.get();
}

/** Returns both the signal value and a setter; re-renders when signal changes. */
export function useSignal<T>(signal: Signal<T>): [T, (value: T) => void] {
  const value = useSignalValue(signal);
  return [value, signal.set.bind(signal)]
}
