import { LitElement, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { GRID_SIZE } from "./Grid.ts";
import { DraggableComponentElement } from "./DraggableElement.ts";

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
    let parent = this.parentElement as DraggableComponentElement;

    let width = parent.width * (this.horizontal ? 50 : 25);
    let height = parent.height * (this.horizontal ? 25 : 50);

    let top = this.horizontal ? height / 2 : 0;
    let left = this.horizontal ? 0 : width / 2;
    let bottom = this.horizontal ? height / 2 : height;
    let right = this.horizontal ? width : width / 2;

    return svg`
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="${width}" height="${height}"
        viewBox="0 0 ${width} ${height}"
        style="width:100%;height:100%"
      >
        <line
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
