export interface Element {
  type: string;
  props: {
    children: Element[];
    [name: string]: any;
  };
}

let nextUnitOfWork: Fiber; // 下一次执行的fiber
let wipRoot: Fiber;
let currentRoot: Fiber; // 上一次的fiber树
let deletions: Fiber[];

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
  // Object.keys(fiber.props)
  //   .filter(isProperty)
  //   .forEach(name => {
  //     // @ts-ignore
  //     dom[name] = fiber.props[name];
  //   });
  updateDom(dom, {}, fiber.props);
  return dom;
  // element.props.children.forEach(child => render(child, dom))
  // container.appendChild(dom)
}

const isNew = (prev: any, next: any) => (key: any) => prev[key] !== next[key];

const isGone = (prev: any, next: any) => (key: any) => !(key in next);

function updateDom(dom: Text | HTMLElement, preProps: any, props: any) {
  // 删除新的中不存在的
  Object.keys(preProps)
  .filter(isProperty)
  .filter(isGone(preProps, props))
  .forEach(name => {
      // @ts-ignore
      dom[name] = '';
    });
    
    // 设置或者更新 新的
    Object.keys(props)
    .filter(isProperty)
    .filter(isNew(preProps, props))
    // @ts-ignore
    .forEach(name => (dom[name] = props[name]));
}
// 递归渲染.
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber: Fiber) {
  if (!fiber) return;
  const domParent = fiber.parent.dom;
  // domParent.appendChild(fiber.dom);
  switch (fiber.effectTag) {
    case 'UPDATE':
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      break;
    case 'PLACEMENT':
      domParent.appendChild(fiber.dom);
      break;
    case 'DELETION':
      domParent.removeChild(fiber.dom);
      break;
    default:
      break;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export function render(element: Element, container: HTMLElement | Text) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
}

// 依赖全局的 nextUnitOfWork和wiproot
function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;
  // 每执行完一个fiber渲染, 就判断一下是否还有时间;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 确保没有vdom, 才进行渲染
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
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
  dom?: HTMLElement | Text; // fiber对应的dom节点
  sibling?: Fiber;
  alternate?: Fiber; // 之前的commit到dom的 fiber tree
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION'; //
}

// 执行渲染, 和返回下一个渲染工作
function performUnitOfWork(fiber: Fiber) {
  // 向dom添加节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber); 
  }
  // 把这一步移走, 分离的遍历fiber和commit的节点
  // if (fiber.parent) {
  //   // 实际上, 是在这一步添加到页面中
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 创建子节点的fiber
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 返回下一个渲染节点
  // 返回child fiber
  if (fiber.child) {
    return fiber.child;
  }

  // 返回兄弟fiber
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    // note: 这里返回的是父节点
    // nextFiber = nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(fiber: Fiber, elements: Fiber[]) {
  let index: number = 0;
  let oldFiber = fiber.alternate && fiber.alternate.child;
  let prevSibling = null; // 中间变量,用来给所有树节点连接兄弟节点
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber: Fiber = null;

    const sameType = oldFiber && element && oldFiber.type === element.type;

    if (sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: fiber.dom,
        alternate: fiber,
        effectTag: 'UPDATE',
      };
    } else {
      // 这里不懂
      if (element) {
        newFiber = {
          type: element.type,
          props: element.props,
          parent: fiber,
          dom: null,
          alternate: null,
          effectTag: 'PLACEMENT',
        };
      }
      if (oldFiber) {
        fiber.effectTag = 'DELETION';
        deletions.push(fiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}
