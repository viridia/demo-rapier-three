type Subscriber<T extends unknown[]> = (...data: T) => void;

/** Simple publish/subscribe signaling mechanism. */
export class EventBus<T extends unknown[]> {
  private subscribers: Array<Subscriber<T>> = [];

  /** Remove all subscribers. */
  public clear() {
    this.subscribers.length = 0;
  }

  /** Listen for events.
      @param subscriber Callback function to listen for events.
      @returns Unsubscribe callback.
  */
  public subscribe(subscriber: Subscriber<T>): () => void {
    const index = this.subscribers.indexOf(subscriber);
    if (index >= 0) {
      console.error('double subscription', subscriber);
    }
    this.subscribers.push(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  /** Stop listening. */
  public unsubscribe(subscriber: Subscriber<T>) {
    const index = this.subscribers.indexOf(subscriber);
    if (index >= 0) {
      this.subscribers.splice(index, 1);
    } else {
      console.warn('subscriber not found:', subscriber);
    }
  }

  /** Signal an event. */
  public publish(...data: T) {
    this.subscribers.forEach(subscriber => subscriber(...data));
  }
}
