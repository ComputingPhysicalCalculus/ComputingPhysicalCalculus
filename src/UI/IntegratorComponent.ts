import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "../../styles/IntegratorComponent.css?inline";
import svgstyles from "../../styles/SVGElement.css?inline";

@customElement("integrator-component")
export class IntegratorComponentElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
    ${unsafeCSS(svgstyles)}
  `;

  render() {
    // viewBox="4 4 92 62"
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="105" height="60"
        viewBox="26 0 172 100"
      >
        <rect class="fill-bg stroke-fg" x="24" y="1" width="175" height="98" stroke-width="2" rx="5" />
        <rect class="stroke-fg" x="115" y="30" width="20" height="40" fill="none" stroke-width="2" rx="2" />
        <circle class="stroke-fg" cx="75" cy="50" r="38" fill="none" stroke-width="2" />

        <line class="stroke-fg" x1="60" y1="50" x2="90" y2="50" stroke-width="2" stroke-linecap="round" />
        <line class="stroke-fg" x1="75" y1="50" x2="75" y2="0" stroke-width="2" stroke-linecap="round" />
        <line class="stroke-fg" x1="125" y1="30" x2="125" y2="0" stroke-width="2" stroke-linecap="round" />
        <line class="stroke-fg" x1="175" y1="30" x2="175" y2="0" stroke-width="2" stroke-linecap="round" />

        <polygon class="fill-fg stroke-fg" stroke-width="2" stroke-linejoin="round" points="170,20 175,30 180,20" />

        ${[-2, -1, 0, 1, 2].map(i => svg`
          <line
            class="stroke-fg"
            x1="115"
            y1="${52 + i * 7}"
            x2="135"
            y2="${48 + i * 7}"
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
