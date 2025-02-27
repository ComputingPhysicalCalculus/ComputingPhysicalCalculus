import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "../../styles/SVGElement.css?inline";

@customElement("gear-pair-component")
export class GearPairComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: Number })
  ratio_top: number = 1;

  @property({ type: Number })
  ratio_bottom: number = 1;

  render() {
    const topX = this.ratio_top < 0 ? "9" : "17";
    const bottomX = this.ratio_bottom < 0 ? "9" : "17";
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="100"
        viewBox="0 0 50 100"
        style="width:100%;height:100%"
      >
        ${[0, 1, 2, 3].map(i => (
          svg`
            <rect class="fill-fg" x="${i % 2 == 0 ? 1 : 41}" y="${Math.floor(i / 2) * 50 + 22}" width="8" height="6" rx="1" />
          `
        ))}
        <rect class="fill-bg stroke-fg" x="5" y="5" width="40" height="90" stroke-width="2" rx=5 />

        <text class="fill-fg" x="${topX}" y="35" font-size="24">${this.ratio_top}</text>
        <text class="fill-fg" x="${bottomX}" y="83" font-size="24">${this.ratio_bottom}</text>

        <circle class="fill-fg" cx="18" cy="50" r="2" />
        <circle class="fill-fg" cx="32" cy="50" r="2" />
      </svg>
    `;
  }
}
