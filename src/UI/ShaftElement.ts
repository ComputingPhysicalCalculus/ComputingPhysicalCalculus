import { LitElement, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("shaft-component")
export class ShaftElement extends LitElement {
  @query("svg")
  _svg!: SVGElement;

  @query("#line")
  _line!: SVGLineElement;

  @property({ type: Boolean })
  horizontal: boolean = false;

  connectedCallback(): void {
    super.connectedCallback();

    let resize_observer = new ResizeObserver(() => this.requestUpdate());
    resize_observer.observe(this);
  }

  render() {
    let top = this.horizontal ? this.offsetHeight / 2 : 0;
    let left = this.horizontal ? 0 : this.offsetWidth / 2;
    let bottom = this.horizontal ? this.offsetHeight / 2 : this.offsetHeight;
    let right = this.horizontal ? this.offsetWidth : this.offsetWidth / 2;
    
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="${this.offsetWidth}" height="${this.offsetHeight}"
        viewBox="0 0 ${this.offsetWidth} ${this.offsetHeight}"
      >
        <line
          id="line"
          x1="${left}" y1="${top}"
          x2="${right}" y2="${bottom}"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shaft-componenet": ShaftElement;
  }
}
