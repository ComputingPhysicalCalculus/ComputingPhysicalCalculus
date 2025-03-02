import { LitElement, svg } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dial-component")
export class DialComponentElement extends LitElement {
  @property({ type: Number })
  count: number = 0;

  tooltip: HTMLSpanElement | undefined;

  getValue(): string {
    let value = this.count.toPrecision(5);
    if (value.includes("e")) {
      value = this.count.toPrecision(2);
    }

    return value;
  }

  updateTooltip(): void {
    if (!this.tooltip) return;

    this.tooltip.textContent = `${this.count.toPrecision(6)}`;
  }

  render() {
    this.updateTooltip();

    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="100" height="50"
        viewBox="0 0 50 50"
        style="width:100%;height:100%"
      >
        <rect x="5" y="10" width="40" height="30" fill="white" stroke="black" stroke-width="2" rx=5 />
        <text text-anchor="middle" dominant-baseline="middle" y="50%" x="50%" fill="black" font-size="8">${this.getValue().substring(0, 7)}</text>
      </svg>
        `
  }
}
