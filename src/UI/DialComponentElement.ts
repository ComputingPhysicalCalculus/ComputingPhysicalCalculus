import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dial-component")
export class DialComponentElement extends LitElement {
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="100" height="50"
        viewBox="0 0 100 50"
        style="width:100%;height:100%"
      >
        <rect x="1" y="1" width="98" height="48" fill="white" stroke="black" stroke-width="2" rx=5 />
      </svg>
        `
  }
}
