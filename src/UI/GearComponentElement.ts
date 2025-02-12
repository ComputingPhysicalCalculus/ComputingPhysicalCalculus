import { LitElement, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import Vector2 from "./Vector2";

export const generator = function*(n: number, min: number, max: number, f: (x: number) => Vector2) {
    for (let i = min; i < max; i += (max - min) / n) {
        yield f(i);
    }
}

@customElement("gear-component")
export class GearComponentElement extends LitElement {
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
        viewBox="-25 -25 50 50"
        style="width:100%;height:100%"
      >
        <circle rx="0" ry="0" r="5" stroke="black" stroke-width="2" fill="black" />
        ${this.inverted ?
          svg`<circle rx="0" ry="0" r="10" stroke="black" stroke-width="2" fill="none" />`
        : ""}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gear-component": GearComponentElement;
  }
}
