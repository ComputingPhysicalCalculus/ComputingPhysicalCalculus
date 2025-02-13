import { query, queryAll } from "./decorators";
import { ComponentType, createComponent } from "./UI/Components";
import { DraggableComponentElement } from "./UI/DraggableElement";
import { setCells } from "./UI/Grid";

const MAX_HISTORY_LENGTH = 32;

export class UndoHistory {
  @queryAll(".placed-component")
  private placedComponents!: NodeListOf<DraggableComponentElement>;

  @query("#content")
  content!: HTMLElement;

  private history: {
    _type: ComponentType,
    data: any,
  }[][] = [];

  private future: {
    _type: ComponentType,
    data: any,
  }[][] = [];

  private _clear_components(): void {
    for (let component of this.placedComponents) {
      let { top, left, width, height } = component;
      component.remove();
      setCells({ x: left, y: top }, { x: width, y: height }, false);
    }
  }

  remove(): void {
    this.history.pop();
  }

  pop_history(): void {
    if (this.history.length < 1) {
      return;
    }

    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    this.future.push(saved_data);

    // Remove current components
    this._clear_components();

    // Restore state
    let newNodes = this.history.pop()!;
    for (let node of newNodes) {
      let component = createComponent(node._type);
      component.import(node.data)

      this.content.appendChild(component);
    }
  }

  pop_future(): void {
    if (this.future.length < 1) {
      return;
    }

    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    this.history.push(saved_data);

    // Remove current components
    this._clear_components();

    // Restore state
    let newNodes = this.future.pop()!;
    for (let node of newNodes) {
      let component = createComponent(node._type);
      component.import(node.data)

      this.content.appendChild(component);
    }
  }

  push(): void {
    this.future.splice(0, this.future.length);

    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    // Append to history, truncating it if it is too long
    this.history.splice(0, Math.max(this.history.length - MAX_HISTORY_LENGTH, 0));
    this.history.push(saved_data);
  }
}

export const UNDO_SINGLETON = new UndoHistory();
