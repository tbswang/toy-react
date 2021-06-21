import { render, createElement } from './index';

function handleClick() {
  console.log('aaa');
}

function HelloWorld() {
  return (
    <div style="background: salmon" onClick={handleClick}>
      <h1>Hello World</h1>
      <h2 style="text-align:right">from Didact</h2>
    </div>
  );
}

const element = <HelloWorld />;

const container = document.getElementById('root');
render(element, container);
