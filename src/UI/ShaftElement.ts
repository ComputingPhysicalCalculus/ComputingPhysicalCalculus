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
    let grid_size = Math.min(this.offsetHeight, this.offsetWidth);
    
    let width = this.offsetWidth / grid_size;
    let height = this.offsetHeight / grid_size;

    let top = this.horizontal ? height / 2 : 0;
    let left = this.horizontal ? 0 : width / 2;
    let bottom = this.horizontal ? height / 2 : height;
    let right = this.horizontal ? width : width / 2;
    
    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="${width * 50}" height="${height * 50}"
        viewBox="0 0 ${width * 50} ${height * 50}"
        style="width:100%;height:100%"
      >
        <line
          id="line"
          x1="${left * 50}" y1="${top * 50}"
          x2="${right * 50}" y2="${bottom * 50}"
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
