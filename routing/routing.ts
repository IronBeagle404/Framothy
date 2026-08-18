import { render, vNode } from "../DOM/virtualDom";

export class Router<T> {
  private routes: Record<string, (state: T) => vNode>;
  private root: HTMLElement;
  private getState: () => T;

  constructor(
    routes: Record<string, (state: T) => vNode>,
    getState: () => T
  ) {
    this.routes = routes;
    this.root = document.getElementById("app")!;
    this.getState = getState;
  }

  updateView(): void {
    const component = this.routes[window.location.pathname];

    if (!component) {
      return;
    }

    this.root.innerHTML = "";
    render(component(this.getState()), this.root);
  }
}