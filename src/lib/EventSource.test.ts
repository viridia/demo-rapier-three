import { test, describe, expect, beforeEach, vi } from 'vitest';
import { EventSource } from './EventSource';

interface EventSourceTypeMap {
  open: boolean;
  close: number;
}

describe('EventSource', () => {
  let es: EventSource<EventSourceTypeMap>;

  beforeEach(() => {
    es = new EventSource<EventSourceTypeMap>();
  });

  test('subscribe', () => {
    const callback = vi.fn();
    const unsub = es.subscribe('open', callback);
    es.emit('open', true);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(true, 'open');
    es.emit('open', false);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(false, 'open');
    unsub();
    es.emit('open', true);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('events', () => {
    const callback = vi.fn();
    es.subscribe('close', callback);
    es.emit('open', true);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
