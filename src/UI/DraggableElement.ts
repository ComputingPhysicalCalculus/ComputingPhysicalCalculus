import { css, html, LitElement, unsafeCSS, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { pickup } from "./Drag";

import Vector2 from "./Vector2.ts"

import styles from "../../styles/DraggableElement.css?inline";
import { GRID_SIZE, worldToScreenPosition } from "./Grid";
import { ComponentType } from "./Components.ts";


// X offset, Y Offset, Width multiplier, Height multiplier
// X and Y offset are multiples of GRID_SIZE
const lookupTable: { [key: string]: number[] } = {
  "vShaft": [0.25, 0, 0.5, 1],
  "hShaft": [0, 0.25, 1, 0.5],
  "crossConnect": [0.125, 0.125, 0.75, 0.75],
  "integrator": [0.44, 0, 0.90, 1],
  "functionTable": [0, 0, 1, 1],
  "differential": [0, 0, 1, 1],
  "outputTable": [0, 0, 1, 1],
  "motor": [0, 0, 1, 1],
  "multiplier": [0, 0, 1, 1],
  "label": [0, 0, 1, 1],
  "gearPair": [0, 0, 1, 1],
  "dial": [0, 0, 1, 1],
};

@customElement("draggable-component")
export class DraggableComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: Number })
  width: number = 1;

  @property({ type: Number })
  height: number = 1;

  @property({ type: Number })
  top: number = 0;

  @property({ type: Number })
  left: number = 0;

  @property({ type: Number })
  renderTop: number = 0;

  @property({ type: Number })
  renderLeft: number = 0;

  @property({ type: Number })
  componentID: number = 0;

  @property({ type: String })
  componentType: string = "";

  @property({ type: Boolean })
  shouldLockCells: boolean = true;

  @property({ type: Boolean })
  hasBeenPlaced: boolean = false;

  @property({ type: Number })
  previousLeft: number = 0;

  @property({ type: Number })
  previousTop: number = 0;

  @property({ type: Number })
  offsetX: number = 0;

  @property({ type: Number })
  offsetY: number = 0;

  @property({ type: Number })
  inputRatio: number = 1;

  @property({ type: Number })
  outputRatio: number = 1;

  export_fn: (_this: DraggableComponentElement) => { _type: ComponentType, data: any } = () => ({ _type: ComponentType.HShaft, data: {} });

  import_fn: (_this: DraggableComponentElement, obj: any) => void = (_obj) => { };

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", pickup, { capture: true });
  }

  getSize(): Vector2 {
    return new Vector2(this.width, this.height);
  }

  getScreenSize(): Vector2 {
    return new Vector2(this.width * GRID_SIZE, this.height * GRID_SIZE);
  }

  getPosition(): Vector2 {
    return new Vector2(this.left, this.top);
  }

  getScreenPosition(): Vector2 {
    return new Vector2(this.renderLeft, this.renderTop);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties !== undefined) {
      if ((changedProperties.has("top") || changedProperties.has("left")) && !(changedProperties.has("renderLeft") || changedProperties.has("renderRight"))) {
        let pos = worldToScreenPosition(new Vector2(this.left * GRID_SIZE, this.top * GRID_SIZE));
        this.renderLeft = pos.x;
        this.renderTop = pos.y;
      }
    }

    this.style.width = `${this.width * GRID_SIZE}px`;
    this.style.height = `${this.height * GRID_SIZE}px`;

    this.style.top = `${this.renderTop}px`;
    this.style.left = `${this.renderLeft}px`;

    const offset = lookupTable[this.componentType as string];
    if (offset) {
      this.style.left = `${this.renderLeft + offset[0] * GRID_SIZE}px`
      this.style.top = `${this.renderTop + offset[1] * GRID_SIZE}px`
      this.style.width = `${this.width * GRID_SIZE * offset[2]}px`
      this.style.height = `${this.height * GRID_SIZE * offset[3]}px`
    }
  }

  export(): { _type: ComponentType, data: any } {
    return this.export_fn(this);
  }

  import(obj: any): void {
    this.import_fn(this, obj)
  }

  render() {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "draggable-component": DraggableComponentElement;
  }
}
