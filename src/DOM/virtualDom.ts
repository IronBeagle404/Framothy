export type vNode = {
  type: string;
  props: Record<string, any>;
  children: (vNode | string)[];
};

/**
 * Creates a virtual node
 */
export function createElement(
  type: string,
  props: Record<string, any> = {},
  ...children: (vNode | string)[]
): vNode {
  return { type, props, children };
}

/**
 * Add / Update / Remove listeners and attributes
 */
function patchProps(
  el: HTMLElement,
  prev: Record<string, any>,
  next: Record<string, any>,
): void {
  // remove listeners/attributes
  for (const key of Object.keys(prev)) {
    if (key in next) continue;
    if (key.startsWith("on")) {
      el.removeEventListener(key.slice(2).toLowerCase(), prev[key]);
    } else {
      el.removeAttribute(key);
    }
  }
  // add/update changed props
  for (const [key, value] of Object.entries(next)) {
    if (prev[key] === value) continue;
    if (key.startsWith("on") && typeof value === "function") {
      el.removeEventListener(key.slice(2).toLowerCase(), prev[key]); // avoid dupes
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, String(value));
    }
  }
}

/**
 * Builds a fresh DOM subtree
 */
function createDOM(node: vNode): HTMLElement {
  const el = document.createElement(node.type);
  patchProps(el, {}, node.props);
  for (const child of node.children) {
    el.appendChild(
      typeof child === "string"
        ? document.createTextNode(child)
        : createDOM(child),
    );
  }
  return el;
}

/**
 * Recursively patches existing DOM
 */
function diff(
  prev: vNode,
  next: vNode,
  parent: HTMLElement,
  index: number,
): void {
  const existing = parent.childNodes[index] as HTMLElement;

  // different tag or no element triggers rebuild as new node
  if (!existing || existing.tagName.toLowerCase() !== next.type) {
    parent.replaceChild(createDOM(next), existing);
    return;
  }

  patchProps(existing, prev.props, next.props);

  const len = Math.max(prev.children.length, next.children.length);
  for (let i = 0; i < len; i++) {
    const a = prev.children[i];
    const b = next.children[i];

    if (b === undefined) {
      // removed
      existing.childNodes[i].remove();
    } else if (a === undefined) {
      // added
      existing.appendChild(
        typeof b === "string" ? document.createTextNode(b) : createDOM(b),
      );
    } else if (typeof a === "string" || typeof b === "string") {
      // text
      if (a !== b) existing.childNodes[i].textContent = String(b);
    } else {
      // recurse
      diff(a, b, existing, i);
    }
  }
}

/**
 * Renders the given vNode inside the given container element.
 * Builds the full DOM the first time, then only patches the diff
 */
export function render(vNode: vNode, container: HTMLElement): void {
  const prev = (container as any)._vNode as vNode | undefined;

  if (!prev) {
    container.appendChild(createDOM(vNode));
  } else {
    while (container.childNodes.length > 1) container.lastChild!.remove();
    diff(prev, vNode, container, 0);
  }
  (container as any)._vNode = vNode;
}
