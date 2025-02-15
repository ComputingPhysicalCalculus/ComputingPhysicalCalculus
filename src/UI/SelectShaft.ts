import { DraggableComponentElement } from "./DraggableElement.ts";
import { startedDragging } from "./Drag.ts";

const SELECTED_SHAFT = "selected";

let selectedItem: DraggableComponentElement | null = null;

export function selectShaft(event: MouseEvent): void {
  if (event.button != 0) { return }
  if (startedDragging) return;

  clearSelect();

  const currentTarget = event.currentTarget as DraggableComponentElement;
  selectedItem = currentTarget;

  selectedItem.classList.add(SELECTED_SHAFT);
}

function clearSelect(): void {
  if (!selectedItem) return;

  selectedItem.classList.remove(SELECTED_SHAFT);

  // Clear Selected Item;
  console.log("Clear Selected");
  selectedItem = null;
}

export function endSelect(event: MouseEvent): void {
  if (event.button != 0) return;
  clearSelect();
}
