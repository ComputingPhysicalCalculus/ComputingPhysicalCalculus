import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { pickup } from "./Drag";

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

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", pickup, { capture: true });
  }

  update() {
    this.style.width = `${this.width * GRID_SIZE}px`;
    this.style.height = `${this.height * GRID_SIZE}px`;

    this.style.top = `${this.top * GRID_SIZE}px`;
    this.style.left = `${this.left * GRID_SIZE}px`;
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
