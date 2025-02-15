import { DraggableComponentElement } from "./DraggableElement.ts";
import { startedDragging } from "./Drag.ts";
import { GRID_SIZE } from "./Grid.ts"

const SELECTED_SHAFT = "selected";
const ARROW_PADDING = 5;

let selectedItem: DraggableComponentElement | null = null;

export function selectShaft(event: MouseEvent): void {
  if (event.button != 0) { return }
  if (startedDragging) return;

  clearSelect();

  const currentTarget = event.currentTarget as DraggableComponentElement;
  selectedItem = currentTarget;

  selectedItem.classList.add(SELECTED_SHAFT);

  const negativeArrow = document.querySelector("#negativeArrow")! as HTMLImageElement;
  const positiveArrow = document.querySelector("#positiveArrow")! as HTMLImageElement;

  const pos = currentTarget.getScreenPosition();
  const size = currentTarget.getScreenSize();

  if (currentTarget.componentType == "hShaft") {
    negativeArrow.style.rotate = "-90deg";
    positiveArrow.style.rotate = "90deg";

    negativeArrow.style.left = `${pos.x - negativeArrow.clientWidth - ARROW_PADDING}px`;
    negativeArrow.style.top = `${pos.y + size.y / 2 - negativeArrow.clientHeight / 2}px`;
    positiveArrow.style.left = `${pos.x + size.x + ARROW_PADDING}px`;
    positiveArrow.style.top = `${pos.y + size.y / 2 - positiveArrow.clientHeight / 2}px`;
  } else {
    negativeArrow.style.rotate = "0deg";
    positiveArrow.style.rotate = "180deg";

    negativeArrow.style.left = `${pos.x + size.x / 2 - negativeArrow.clientWidth / 2}px`;
    negativeArrow.style.top = `${pos.y - negativeArrow.clientHeight - ARROW_PADDING}px`;
    positiveArrow.style.left = `${pos.x + size.x / 2 - positiveArrow.clientWidth / 2}px`;
    positiveArrow.style.top = `${pos.y + size.y + ARROW_PADDING}px`;
  }

  negativeArrow.style.visibility = "visible";
  positiveArrow.style.visibility = "visible";
}

export function clearSelect(): void {
  if (!selectedItem) return;

  selectedItem.classList.remove(SELECTED_SHAFT);

  // Clear Selected Item;
  console.log("Clear Selected");
  selectedItem = null;

  const negativeArrow = document.querySelector("#negativeArrow")! as HTMLImageElement;
  const positiveArrow = document.querySelector("#positiveArrow")! as HTMLImageElement;

  negativeArrow.style.visibility = "hidden";
  positiveArrow.style.visibility = "hidden";
}

export function endSelect(event: MouseEvent): void {
  if (event.button != 0) return;
  clearSelect();
}
