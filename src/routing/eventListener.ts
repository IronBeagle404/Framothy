import { vNode } from "../DOM/virtualDom";
import { route } from "./routing";

/**
Prevents duplicate listeners
*/
let isListening = false;

/**
Adds navigation to links marked with the data-link attribute
*/
export function eventListener(routes: Record<string, () => vNode>) {
	if (isListening) {
		return;
	}

	isListening = true;

	document.querySelectorAll("[data-link]").forEach(link => {
		link.addEventListener("click", event => {

            /**
			Keep the page loaded while changing the URL and rendering the new route
            */
			event.preventDefault();

			const path = (link as HTMLAnchorElement).pathname;

			history.pushState({}, "", path);

			route(routes);
		});
	});
}
