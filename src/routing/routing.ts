import { render, vNode } from "../DOM/virtualDom";
import { eventListener } from "./eventListener";

/**
Renders the component that matches the current URL path
*/
export function route(routes: Record<string, () => vNode>) {
  eventListener(routes);
  const path = window.location.pathname;
  const component = routes[path];

  if (!component) {
    return;
  }

  /**
  Clear the previous page before rendering the selected component
  */
  const root = document.getElementById("app")!;

  root.innerHTML = "";
  render(component(), root);
}