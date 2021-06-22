import { render, createElement,  useState} from './index';

function handleClick() {
  console.log('aaa');
}

function Counter() {
  const [state, setState] = useState(1);
  return <h1 onClick={() => setState(c => c + 1)}>Count: {state}</h1>;
}
function HelloWorld() {
  return (
    <div style="background: salmon" onClick={handleClick}>
      <h1>Hello World</h1>
      <h2 style="text-align:right">from Didact</h2>
      <Counter />
    </div>
  );
}

const element = <HelloWorld />;

const container = document.getElementById('root');
render(element, container);
