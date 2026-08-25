# Mini-Framework

## Virtual Dom

### 1. vNode

```
  type: string;
  props: Record<string, any>;
  children: (vNode | string)[];
```

`type` is a string, such as `div` or `p`.

`props` is an object containing key-value pairs. The key is a string, and the value can be any type, such as a string, number, or boolean.

`children` is an array that can contain either a vNode or a string.

### 2. createElement

`createElement` is a function that takes these arguments:

```
  type: string,
  props: Record<string, any> = {},
  ...children: (vNode | string)[]
```

`type` is a string containing the element name.

`props` is an object containing the element's attributes.

`...children` is a rest parameter that collects vNodes and strings into an array.

The function returns a vNode containing the type, props, and children.

### 3. render

`render` creates a real DOM element using the vNode's type:

```
const element = document.createElement(vNode.type);
```

It then sets the element's attributes using the vNode's props:

```
  for (const [key, value] of Object.entries(vNode.props)) {
    element.setAttribute(key, String(value));
  }
```

Finally, it renders each child.

- If the child is a string, it creates and appends a text node.
- If the child is another vNode, it recursively calls `render` for that child.

After all children are rendered, the new element is appended to the container.

```
  vNode.children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      render(child, element);
    }
  });

  container.appendChild(element);
```
