const RENDER_TO_DOM = Symbol('render to dom');

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    // 绑定事件
    if(name.match(/^on[\s\S]+$/)){
      this.root.addEventlistene
    } else if( name === 'className'){

    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  
}

export class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
  }
}

export function createElement(type, attributes, ...children) {
  let e;
  // 针对原生的tag, 需要进行包装
  if (typeof type === 'string') {
    e = new ElementWrapper(type);
  } else {
    e = new type;
  }

  for (let p in attributes) {
    e.setAttribute(p, attributes[p]);
  }
  let insertChildren = children => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child);
      } else {
        e.appendChild(child);
      }
    }
  };

  insertChildren(children);
  return e;
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root);
}
