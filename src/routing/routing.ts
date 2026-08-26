import { render, vNode } from "../DOM/virtualDom";

// Registers the URL paths with corresponding components
export function route(routes: Record<string, () => vNode>) {

  // Renders the component that matches the current URL hash
  const renderRoute = () => {
    const path = window.location.hash.slice(1) || "/";
    const component = routes[path];

    if (!component) {
      return;
    }

    // Clear the previous page and render the selected component
    const root = document.getElementById("app")!;
    root.innerHTML = "";
    render(component(), root);
  };

  // Render at every URL change
  window.addEventListener("hashchange", renderRoute);

  /**
  Render the route at start
  */
  renderRoute();
}
