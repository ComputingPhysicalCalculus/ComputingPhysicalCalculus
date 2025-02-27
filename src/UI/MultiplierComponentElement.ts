import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "../../styles/SVGElement.css?inline";

@customElement("multiplier-component")
export class MultiplierComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="150" height="150"
        viewBox="0 0 150 100"
        style="width:100%;height:100%"
      >
        <rect class="fill-bg stroke-fg" x="1" y="1" width="148" height="98" stroke-width="2" rx=5 />
        <circle class="stroke-fg" cx="50" cy="50" r="40" fill="none" stroke-width="2" />
        <line
          class="stroke-fg"
          x1="${50 - Math.SQRT2 * 40 / 2}"
          y1="${50 + Math.SQRT2 * 40 / 2}"
          x2="${50 + Math.SQRT2 * 40 / 2}"
          y2="${50 - Math.SQRT2 * 40 / 2}"
          stroke-width="2" linecap="round"
        />
        <line class="stroke-fg" x1="75" y1="0" x2="75" y2="75" stroke-width="2" linecap="round" />
        <line class="stroke-fg" x1="40" y1="60" x2="75" y2="60" troke-width="2" linecap="round" />
        <polygon class="stroke-fg fill-fg" stroke-width="2" stroke-linejoin="round" points="40,60 50,55 50,65" />
        <line class="stroke-fg" x1="125" y1="0" x2="125" y2="50" stroke-width="2" linecap="round" />
        <polygon class="stroke-fg fill-fg" stroke-width="2" stroke-linejoin="round" points="120,50 125,60 130,50" />
        <line class="stroke-fg" fill="fill-fg" stroke-width="2" x1="25" y1="0" x2="25" y2="19"/>
      </svg>
    `;
  }
}
