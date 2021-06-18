import { render, createElement } from "./index";

const element = (
  <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);
const container = document.getElementById("root");
render(element, container);
