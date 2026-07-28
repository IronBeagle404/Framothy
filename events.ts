type EventHandler = (...args: unknown[]) => void;

export interface EventEmitter {
  events: Map<string, EventHandler[]>;
}

export function createEmitter(): EventEmitter {
  return {
    events: new Map(),
  };
}

export function on(
  emitter: EventEmitter,
  event: string,
  handler: EventHandler
): void {
  if (!emitter.events.has(event)) {
    emitter.events.set(event, []);
  }
  emitter.events.get(event)!.push(handler);
}

export function off(
  emitter: EventEmitter,
  event: string,
  handler: EventHandler
): void {
  const handlers = emitter.events.get(event);
  if (!handlers) return;
  const index = handlers.indexOf(handler);
  if (index !== -1) handlers.splice(index, 1);
}

export function emit(
  emitter: EventEmitter,
  event: string,
  ...args: unknown[]
): void {
  const handlers = emitter.events.get(event);
  if (!handlers) return;
  for (const handler of handlers) {
    handler(...args);
  }
}
