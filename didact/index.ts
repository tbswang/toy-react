export interface Element {
  type: string;
  props: {
    children: Element[];
    [name: string]: any;
  };
}

export function createElement(type: string, props: any, ...children: Element[]): Element {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'string' ? createTextElement(child) : child
      ),
    },
  };
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      // @ts-ignore
      children: [], // 多余的
    },
  };
}

const isProperty = (key: string) => key !== 'children';

function createDom(fiber: Fiber) {
  let dom: Text | HTMLElement;
  switch (fiber.type) {
    case 'TEXT_ELEMENT':
      dom = document.createTextNode('');
      break;

    default:
      dom = document.createElement(fiber.type);
      break;
  }
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      // @ts-ignore
      dom[name] = fiber.props[name];
    });
  return dom;
  // element.props.children.forEach(child => render(child, dom))
  // container.appendChild(dom)
}

let nextUnitOfWork: Fiber;

export function render(element: Element, container: HTMLElement | Text) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;
  // 每执行完一个fiber渲染, 就判断一下是否还有时间;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    console.log('🚀 ~ file: index.ts ~ line 73 ~ workLoop ~ deadline.timeRemaining()', deadline.timeRemaining());
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

// 启动函数
requestIdleCallback(workLoop);

export interface Fiber {
  type?: string;
  props: any;
  parent?: Fiber;
  child?: Fiber;
  dom?: HTMLElement | Text;
  sibling?: Fiber;
}

// 执行渲染, 和返回下一个渲染工作
function performUnitOfWork(fiber: Fiber) {
  // 向dom添加节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    // 实际上, 是在这一步添加到页面中
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 创建子节点的fiber
  const elements = fiber.props.children;
  let index: number = 0;
  let prevSibling = null; // 中间变量,用来给所有树节点连接兄弟节点
  while (index < elements.length) {
    const element = elements[index];
    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // 返回下一个渲染节点
  // 返回child fiber
  if (fiber.child) {
    return fiber.child;
  }

  // 返回兄弟fiber
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.sibling;
  }
}
