import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "../../styles/SVGElement.css?inline";

@customElement("differential-component")
export class DifferentialCopmonentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="150"
        viewBox="0 0 50 150"
        style="width:100%;height:100%"
      >
        ${[0, 1, 2, 3, 4, 5].map(i => (
          svg`
            <rect class="fill-fg" x="${i % 2 == 0 ? 1 : 41}" y="${Math.floor(i / 2) * 50 + 22}" width="8" height="6" rx="1" />
          `
        ))}
        <rect class="fill-bg stroke-fg" x="5" y="5" width="40" height="140" stroke-width="2" rx=5 />
        <polyline
          class="stroke-fg"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          points="35,88 15,88 25,75 15,62 35,62"
        />
      </svg>
    `;
  }
}
