import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { pickup } from "./Drag";

import styles from "../../styles/DraggableElement.css?inline";

@customElement("draggable-component")
export class DraggableComponentElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  
  @property({ type: Number })
  width: number = 1;

  @property({ type: Number})
  height: number = 1;

  private _handle_mousedown(e: MouseEvent) {
    pickup(e);
  }
  
  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", this._handle_mousedown, { capture: true });
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
