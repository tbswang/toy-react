import { createElement, Component, render } from './toy-react.js';

// class MyComponent extends Component {
//   render() {
//     return (
//       <div>
//         <h1>my Component</h1>
//         {this.children}
//       </div>
//     );
//   }
// }

render(
  // <MyComponent id="a" class="c">
  <div
    onClick={() => {
      console.log('a');
    }}
  >
    acb
  </div>,
  // </MyComponent>,
  document.getElementById('root'),
);
