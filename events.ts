interface CustomEvent {
  type: string;
  target: EventNode;
  [key: string]: unknown;
}

type EventHandler = (event: CustomEvent) => void;

export interface EventNode {
  listeners: Map<string, EventHandler[]>;
  parent: EventNode | null;
  children: EventNode[];
}

export function createEventNode(parent: EventNode | null = null): EventNode {
  return {
    listeners: new Map(),
    parent,
    children: [],
  };
}

export function addEventListener(
  node: EventNode,
  eventType: string,
  handler: EventHandler
): void {
  if (!node.listeners.has(eventType)) {
    node.listeners.set(eventType, []);
  }
  node.listeners.get(eventType)!.push(handler);
}

export function removeEventListener(
  node: EventNode,
  eventType: string,
  handler: EventHandler
): void {
  const handlers = node.listeners.get(eventType);
  if (!handlers) return;
  const index = handlers.indexOf(handler);
  if (index !== -1) handlers.splice(index, 1);
}

export function dispatchEvent(
  node: EventNode,
  eventType: string,
  eventData: Record<string, unknown> = {}
): void {
  const event = { type: eventType, target: node, ...eventData };

  let current: EventNode | null = node;
  while (current) {
    const handlers = current.listeners.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
    current = current.parent;
  }
}

export function addChild(parent: EventNode, child: EventNode): void {
  child.parent = parent;
  parent.children.push(child);
}
