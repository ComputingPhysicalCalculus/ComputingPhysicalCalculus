import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../../styles/SVGElement.css?inline";

@customElement("motor-component")
export class MotorComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: Boolean })
  inverted: boolean = false;

  render() {
    return svg`
      <svg
        style="width:100%;height:100%;transform:rotateY(${this.inverted ? 180 : 0}deg)"
        xmlns="https://www.w3.org/2000/svg"
        width="100" height="50"
        viewBox="0 0 100 50"
      >
        <rect class="fill-bg stroke-fg" x="11" y="1" width="70" height="48" stroke-width="2" rx="5" />
        <rect class="fill-bg stroke-fg" x="81" y="10" width="10" height="30" stroke-width="2" rx="2" />
        <rect class="fill-fg stroke-fg" x="91" y="20" width="8" height="10" stroke-width="2" rx="2" />

        ${[ -2, -1, 0, 1, 2 ].map(i => svg`
          <line
            class="stroke-fg"
            x1="11"
            y1="${25 + i * 6}"
            x2="81"
            y2="${25 + i * 6}"
            stroke-width="2"
            stroke-linecap="round"
          />
        `)}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "motor-component": MotorComponentElement;
  }
}
