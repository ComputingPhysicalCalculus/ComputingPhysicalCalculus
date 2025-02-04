import { LitElement, svg } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("integrator-component")
export class IntegratorComponentElement extends LitElement {
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="100" height="70"
        viewBox="0 -5 100 75"
      >
        <rect x="5" y="5" width="90" height="60" fill="none" stroke="black" stroke-width="2" rx="5" />
        <rect x="44" y="25" width="12" height="20" fill="none" stroke="black" stroke-width="2" rx="2" />
        <circle cx="26" cy="35" r="18" fill="none" stroke="black" stroke-width="2" />
        <line x1="18" y1="35" x2="34" y2="35" stroke="black" stroke-width="2" stroke-linecap="round" />
        <polygon fill="black" stroke="black" stroke-width="2" stroke-linejoin="round" points="74,4 71,-3 77,-3" />

        ${[ 0, 1, 2, 3 ].map(i => svg`
          <line
            x1="45"
            y1="${29 + i * 5}"
            x2="55"
            y2="${26 + i * 5}"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
          />
        `)}
      </svg>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "integrator-component": IntegratorComponentElement;
  }
}
