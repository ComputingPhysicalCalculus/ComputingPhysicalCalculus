import { ComponentType, createComponent, stringToComponent } from "./Components.ts"
import Vector2 from "./Vector2.ts"
import { GRID_SIZE, allValid, setCells, highlightHoveredCells, screenToWorldPosition, worldToScreenPosition, validShaft } from "./Grid.ts";
import { DraggableComponentElement } from "./DraggableElement.ts";
import { UNDO_SINGLETON } from "@src/Undo.ts";
import { endSelect } from "./SelectShaft.ts";
import { machine } from "./Constants.ts";

type DragItem = {
  item: DraggableComponentElement | null,
  mouseX: number,
  mouseY: number,
};

let curDragItem: DragItem = { item: null, mouseX: 0, mouseY: 0 };
let canStartDragging: boolean = false;
export let startedDragging: boolean = false;
let startDraggingRadius: number = 5;

function createNewObject(x: number, y: number, typeString: string): void {
  const componentType: ComponentType | null = stringToComponent(typeString);

  if (componentType == null)
    return;

  const item = createComponent(componentType);

  curDragItem.item = item;

  const cellSize = item.getSize();
  item.offsetX = -(Math.floor((cellSize.x + 1) / 2)) * GRID_SIZE + (GRID_SIZE / 2);
  item.offsetY = -(Math.floor((cellSize.y + 1) / 2)) * GRID_SIZE + (GRID_SIZE / 2);

  const posX: number = x + item.offsetX;
  const posY: number = y + item.offsetY;

  item.classList.add("dragged");

  item.renderLeft = posX;
  item.renderTop = posY;

  canStartDragging = true;
  startedDragging = true;

  machine.appendChild(item);
}

export function setupDragHooks(): void {
  const list = document.querySelectorAll('.component');
  list.forEach(element => {
    (element as HTMLElement).addEventListener("mousedown", creation);
  });

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", drop);
}

function creation(event: MouseEvent): void {
  if (event.button != 0) return;

  const target = event.currentTarget as HTMLDivElement;
  const type: string = target.dataset.type as string;
  createNewObject(event.clientX, event.clientY, type);
}

function calculateTopLeftCell(mousePos: Vector2): Vector2 | null {
  if (curDragItem.item == null) {
    return null;
  }

  mousePos = screenToWorldPosition(mousePos);

  let currentMouseCol = Math.floor(mousePos.x / GRID_SIZE);
  let currentMouseRow = Math.floor(mousePos.y / GRID_SIZE);

  const offX = Math.floor(-curDragItem.item.offsetX / GRID_SIZE);
  const offY = Math.floor(-curDragItem.item.offsetY / GRID_SIZE);

  const placementCol = currentMouseCol - offX;
  const placementRow = currentMouseRow - offY;

  return new Vector2(placementCol, placementRow);
}

export function pickup(event: MouseEvent): void {
  if (event.button != 0) { return }

  const currentTarget = event.currentTarget as DraggableComponentElement;
  canStartDragging = true;

  // Will come up with a better solution
  UNDO_SINGLETON.push();

  currentTarget.classList.add("dragged");

  curDragItem.item = currentTarget;

  const pos = currentTarget.getScreenPosition();
  const diffX = pos.x - event.clientX;
  const diffY = pos.y - event.clientY;

  currentTarget.offsetX = diffX;
  currentTarget.offsetY = diffY;

  curDragItem.mouseX = event.clientX;
  curDragItem.mouseY = event.clientY;
}

function startDragging(): void {
  if (!curDragItem.item) return;

  // Refree the cells below the item that has just started to be dragged
  const size = curDragItem.item.getSize();

  let topLeft = new Vector2(0, 0);
  topLeft.x = Number(curDragItem.item.left);
  topLeft.y = Number(curDragItem.item.top);

  if (curDragItem.item.shouldLockCells) setCells(topLeft, size, false);

  highlightHoveredCells(topLeft, size, true);

  curDragItem.item.previousLeft = topLeft.x;
  curDragItem.item.previousTop = topLeft.y;
}

function move(event: MouseEvent): void {
  if (curDragItem.item == null || !canStartDragging) {
    return;
  }

  endSelect(event);

  if (!startedDragging) {
    let diffX = event.clientX - curDragItem.mouseX;
    let diffY = event.clientY - curDragItem.mouseY;
    if (diffX * diffX + diffY * diffY < startDraggingRadius * startDraggingRadius) {
      return;
    }
    startedDragging = true;
    startDragging();
  }

  const previousPos = calculateTopLeftCell(new Vector2(curDragItem.mouseX, curDragItem.mouseY));
  const size = curDragItem.item.getSize()

  if (previousPos == null || size == null) return;

  highlightHoveredCells(previousPos, size, false);

  curDragItem.item.renderLeft = event.clientX + curDragItem.item.offsetX;
  curDragItem.item.renderTop = event.clientY + curDragItem.item.offsetY;
  curDragItem.mouseX = event.clientX;
  curDragItem.mouseY = event.clientY;

  const newPos = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));
  if (newPos == null) return;

  highlightHoveredCells(newPos, size, true);
}

function drop(event: MouseEvent): void {
  if (event.button != 0) { return }

  if (curDragItem.item == null || !startedDragging) {
    canStartDragging = false;
    return
  }

  canStartDragging = false;
  startedDragging = false;

  const item = curDragItem.item;
  item.classList.remove("dragged");

  let topLeft = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));
  const size = item.getSize();

  if (topLeft == null || size == null) return;

  highlightHoveredCells(topLeft, size, false);

  // Check whether or not the item being dragged can be placed
  {
    if ((item.shouldLockCells && !allValid(topLeft, size)) || (!item.shouldLockCells && !validShaft(topLeft, item))) {
      if (!item.hasBeenPlaced) {
        item.remove();
        curDragItem.item = null;
        return;
      }

      topLeft.x = Number(item.previousLeft);
      topLeft.y = Number(item.previousTop);
    }



    if (item.shouldLockCells) {
      setCells(topLeft, size, true);
    }
  }

  const grid = document.getElementById("grid") as HTMLDivElement;

  // Delete element because it is out of bounds
  {
    let worldTopLeft = worldToScreenPosition(new Vector2(topLeft.x * GRID_SIZE, topLeft.y * GRID_SIZE));
    // let worldBottomRight = worldToScreenPosition(new Vector2((topLeft.x + size.x) * GRID_SIZE, (topLeft.y + size.y) * GRID_SIZE));

    if (worldTopLeft.x > grid.clientWidth) {
      item.remove();
      curDragItem.item = null;
      if (item.shouldLockCells) {
        setCells(topLeft, size, false);
      }
      return;
    }
  }

  item.hasBeenPlaced = true;
  item.left = topLeft.x;
  item.top = topLeft.y;
  let converted = worldToScreenPosition(new Vector2(topLeft.x * GRID_SIZE, topLeft.y * GRID_SIZE));
  item.renderLeft = converted.x;
  item.renderTop = converted.y;

  item.updated();

  curDragItem.item = null;
}
