import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { pickup } from "./Drag";

import Vector2 from "./Vector2.ts"

import styles from "../../styles/DraggableElement.css?inline";
import { GRID_SIZE } from "./Grid";

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
  componentID: number = 0;

  @property({ type: String })
  componentType: string = "";

  @property({ type: Boolean })
  shouldLockCells: boolean = true;

  @property({ type: Boolean })
  hasBeenPlaced: boolean = false;

  @property({ type: Boolean })
  dontUpdatePosition: boolean = false;

  @property({ type: Number })
  previousLeft: number = 0;

  @property({ type: Number })
  previousTop: number = 0;

  @property({ type: Number })
  offsetX: number = 0;

  @property({ type: Number })
  offsetY: number = 0;


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
    return new Vector2(this.left * GRID_SIZE, this.top * GRID_SIZE);
  }

  updated() {
    this.style.width = `${this.width * GRID_SIZE}px`;
    this.style.height = `${this.height * GRID_SIZE}px`;

    if (!this.dontUpdatePosition) {
      this.style.top = `${this.top * GRID_SIZE}px`;
      this.style.left = `${this.left * GRID_SIZE}px`;
    }
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
    "draggable": DraggableComponentElement;
  }
}
