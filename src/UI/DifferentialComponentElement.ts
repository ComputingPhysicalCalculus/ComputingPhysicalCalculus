import { LitElement, svg } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("differential-component")
export class DifferentialCopmonentElement extends LitElement {
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="150"
        viewBox="0 0 50 150"
        style="width:100%;height:100%"
      >
        <rect x="5" y="5" width="40" height="140" fill="white" stroke="black" stroke-width="2" rx=5 />
        <polyline
          fill="none"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          points="35,88 15,88 25,75 15,62 35,62"
        />
      </svg>
    `;
  }
}
