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

  private _handle_mousedown(e: MouseEvent) {
    pickup(e);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", this._handle_mousedown, { capture: true });
  }

  render() {
    this.style.width = `${this.width * GRID_SIZE}px`;
    this.style.height = `${this.height * GRID_SIZE}px`;
    
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
