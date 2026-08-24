import { render, vNode } from "../DOM/virtualDom";

export function route(routes: Record<string, () => vNode>) {
  const path = window.location.pathname;
  const component = routes[path];

  if (!component) {
    return;
  }

  const root = document.getElementById("app")!;

  root.innerHTML = "";
  render(component(), root);
}