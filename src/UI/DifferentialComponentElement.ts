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
      >
        <rect x="1" y="1" width="48" height="148" fill="none" stroke="black" stroke-width="2" rx=5 />
        <polyline
          fill="none"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          points="35,116 15,116 25,103 15,90 35,90"
        />
      </svg>
    `;
  }
}
