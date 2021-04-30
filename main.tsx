import { createElement, Component, render } from './toy-react';


class MyComponent extends Component {
  state: any;
  constructor() {
    super();
    this.state = {
      a: 1,
    };
  }
  render() {
    return (
      <div>
        <h1>my Component</h1>
        {/* {this.state.a} */}
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
