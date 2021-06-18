export interface Element {
  type: string
  props: {
    children: Element[]
    [name: string]: any
  }
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
  }
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      // @ts-ignore
      children: [], // 多余的
    },
  }
}

const isProperty = (key: string) => key !== 'children'

export function render(element: Element, container: Text | HTMLElement) {
  let dom: Text | HTMLElement
  switch (element.type) {
    case 'TEXT_ELEMENT':
      dom = document.createTextNode('')
      break

    default:
      dom = document.createElement(element.type)
      break
  }
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      // @ts-ignore
      dom[name] = element.props[name]
    })

  element.props.children.forEach(child => render(child, dom))
  container.appendChild(dom)
}
