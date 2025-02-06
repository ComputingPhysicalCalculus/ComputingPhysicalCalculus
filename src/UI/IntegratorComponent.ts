import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "../../styles/IntegratorComponent.css?inline";

@customElement("integrator-component")
export class IntegratorComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  
  render() {
        // viewBox="4 4 92 62"
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="90" height="60"
        viewBox="0 0 150 100"
      >
        <rect x="1" y="1" width="148" height="98" fill="none" stroke="black" stroke-width="2" rx="5" />
        <rect x="65" y="30" width="20" height="40" fill="none" stroke="black" stroke-width="2" rx="2" />
        <circle cx="35" cy="50" r="30" fill="none" stroke="black" stroke-width="2" />
        <line x1="20" y1="50" x2="50" y2="50" stroke="black" stroke-width="2" stroke-linecap="round" />

        <polygon fill="black" stroke="black" stroke-width="2" stroke-linejoin="round" points="107.5,20 112.5,30 117.5,20" />

        ${[ -2, -1, 0, 1, 2 ].map(i => svg`
          <line
            x1="65"
            y1="${52 + i * 7}"
            x2="85"
            y2="${48 + i * 7}"
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
