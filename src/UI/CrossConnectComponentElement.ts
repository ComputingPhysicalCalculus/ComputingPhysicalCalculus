import { css, LitElement, svg, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import Vector2 from "./Vector2";
import styles from "../../styles/SVGElement.css?inline";

export const generator = function*(n: number, min: number, max: number, f: (x: number) => Vector2) {
  for (let i = min; i < max; i += (max - min) / n) {
    yield f(i);
  }
}

@customElement("cross-connect-component")
export class CrossConnectComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: Boolean })
  inverted: boolean = false;

  render() {
    // let points = generator(180, 0, Math.PI * 2, theta => {
    //   let a = -0.6;
    //   let b = 0;
    //   let smoothstep = (x: number) => Math.min(Math.max((x - a)/(b - a), 0), 1);
    //   let f = (x: number) => smoothstep(Math.atan(Math.cos(this.teeth * x)))/4 + 3/4;

    //   return new Vector2(
    //     Math.cos(theta) * f(theta) * 24,
    //     Math.sin(theta) * f(theta) * 24,
    //   );
    // });

    // let points_string = Array.from(points).map(({ x, y }: Vector2) => `${x},${y}`).join(" ")

    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="50"
        viewBox="0 0 50 50"
        style="width:100%;height:100%"
      >
      <circle class="fill-fg stroke-fg" cx="25" cy="25" r="7" stroke="black"/>
      <rect class="fill-fg stroke-fg" x="13" width="24" y="22" height="6" stroke="black" rx="1"/>
      <rect class="fill-fg stroke-fg" x="22" width="6" y="13" height="24" stroke="black" rx="1"/>
        ${this.inverted ?
        svg`<circle class="stroke-fg" cx="25" cy="25" r="13" stroke-width="2" fill="none" />`
        : ""}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cross-connect-component": CrossConnectComponentElement;
  }
}
