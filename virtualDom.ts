type vNode = {
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
 * Renders a virtual node inside the given container
 */
export function render(vNode: vNode, container: HTMLElement): void {
  const element = document.createElement(vNode.type);
  container.appendChild(element);
}
