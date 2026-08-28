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
 * Renders a virtual node into a container, replacing any existing content.
 */
export function render(vNode: vNode, container: HTMLElement): void {
  container.replaceChildren();
  mount(vNode, container);
}

/**
 * Creates the DOM tree for a virtual node and appends it to the container.
 */
function mount(vNode: vNode, container: HTMLElement): void {
  const element = document.createElement(vNode.type);

  // Set properties
  for (const [key, value] of Object.entries(vNode.props)) {
    if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, String(value));
    }
  }

  // Render children
  vNode.children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      mount(child, element);
    }
  });

  container.appendChild(element);
}
