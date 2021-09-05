/** Abstract interface for disposable objects. */
export interface IDisposable {
  dispose(): void;
}

/** Collection of disposeable objects. All objects will be freed when 'dispose' is called. */
export class ResourcePool implements IDisposable {
  // Set of all object handles. This is created lazily when the first object is added.
  private contents: Set<IDisposable> | null = null;

  constructor() {
    this.add = this.add.bind(this);
  }

  /** Dispose all objects in the pool, and then clear the pool. */
  public dispose(): void {
    if (this.contents) {
      this.contents.forEach(disposable => disposable.dispose());
      this.contents.clear();
    }
  }

  /** Schedule a task to dispose all of the objects that are in the pool now, while
      also creating a new pool. This can be useful in cases where you have shared refcountable
      objects that persist between one lifecycle and another.
   */
  public scheduleDispose(): void {
    if (this.contents) {
      const oldContents = this.contents;
      this.contents = null;
      window.setTimeout(() => {
        oldContents.forEach(disposable => disposable.dispose());
      }, 0);
    }
  }

  /** Add an object to the pool. Returns the object after adding it. */
  public add<T extends IDisposable>(disposable: T): T {
    if (!this.contents) {
      this.contents = new Set();
    }
    this.contents.add(disposable);
    return disposable;
  }

  /** Remove an object from the pool. */
  public remove<T extends IDisposable>(disposable: T): T {
    if (this.contents) {
      this.contents.delete(disposable);
    }
    return disposable;
  }
}
