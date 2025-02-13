import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("gear-pair-component")
export class GearPairComponentElement extends LitElement {
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="100"
        viewBox="0 0 50 100"
        style="width:100%;height:100%"
      >
        <rect x="1" y="1" width="48" height="98" fill="white" stroke="black" stroke-width="2" rx=5 />
      </svg>
    `;
  }
}
