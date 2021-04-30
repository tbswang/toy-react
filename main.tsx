import { createElement, Component, render } from './toy-react';

console.log('🚀 ~ file: main.tsx ~ line 2 ~ createElement', createElement);

class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>my Component</h1>
        {this.children}
      </div>
    );
  }
}
render(
  // @ts-ignore
  <MyComponent id="a" class="c">
    <div>acb</div>
  </MyComponent>,
  document.getElementById('root'),
);
