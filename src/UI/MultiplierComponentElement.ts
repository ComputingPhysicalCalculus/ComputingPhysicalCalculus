import { LitElement, svg } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("multiplier-component")
export class MultiplierComponentElement extends LitElement {
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="150" height="150"
        viewBox="0 0 150 100"
        style="width:100%;height:100%"
      >
        <rect x="1" y="1" width="148" height="98" fill="white" stroke="black" stroke-width="2" rx=5 />
        <circle cx="50" cy="50" r="40" fill="none" stroke="black" stroke-width="2" />
        <line
          x1="${50 - Math.SQRT2 * 40 / 2}"
          y1="${50 + Math.SQRT2 * 40 / 2}"
          x2="${50 + Math.SQRT2 * 40 / 2}"
          y2="${50 - Math.SQRT2 * 40 / 2}"
          stroke="black" stroke-width="2" linecap="round"
        />
        <line x1="75" y1="0" x2="75" y2="75" stroke="black" stroke-width="2" linecap="round" />
        <line x1="40" y1="60" x2="75" y2="60" stroke="black" stroke-width="2" linecap="round" />
        <polygon fill="black" stroke="black" stroke-width="2" stroke-linejoin="round" points="40,60 50,55 50,65" />
        <line x1="125" y1="0" x2="125" y2="50" stroke="black" stroke-width="2" linecap="round" />
        <polygon fill="black" stroke="black" stroke-width="2" stroke-linejoin="round" points="120,50 125,60 130,50" />
      </svg>
    `;
  }
}
