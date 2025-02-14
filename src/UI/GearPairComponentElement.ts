import { LitElement, svg } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("gear-pair-component")
export class GearPairComponentElement extends LitElement {
  @property({ type: Number })
  ratio_top: number = 1;

  @property({ type: Number })
  ratio_bottom: number = 1;
  
  render() {
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="50" height="100"
        viewBox="0 0 50 100"
        style="width:100%;height:100%"
      >
        <rect x="5" y="5" width="40" height="90" fill="white" stroke="black" stroke-width="2" rx=5 />

        <text x="17" y="35" font-size="24" fill="black">${this.ratio_top}</text>
        <text x="17" y="83" font-size="24" fill="black">${this.ratio_bottom}</text>

        <circle cx="18" cy="50" r="2" fill="black" />
        <circle cx="32" cy="50" r="2" fill="black" />
      </svg>
    `;
  }
}
