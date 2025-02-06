import { ComponentType, createComponent, stringToComponent } from "./Components.ts"
import Vector2 from "./Vector2.ts"
import { GRID_SIZE, allValid, setCells, highlightHoveredCells } from "./Grid.ts";
import { DraggableComponentElement } from "./DraggableElement.ts";

type DragItem = {
  item: DraggableComponentElement | null,
  mouseX: number,
  mouseY: number,
};

let curDragItem: DragItem = { item: null, mouseX: 0, mouseY: 0 };

const opacity_moving: string = "10%";

function createNewObject(x: number, y: number, typeString: string): void {
  const componentType: ComponentType | null = stringToComponent(typeString);

  if (componentType == null)
    return;

  const item = createComponent(componentType);

  item.dontUpdatePosition = true;
  item.updated();

  curDragItem.item = item;

  const size = item.getScreenSize();
  item.offsetX = -size.x / 2;
  item.offsetY = -size.y / 2;

  const posX: number = x + item.offsetX;
  const posY: number = y + item.offsetY;

  item.style.opacity = opacity_moving;

  item.style.top = `${posY}px`;
  item.style.left = `${posX}px`;

  document.getElementById("content")!.appendChild(item);
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
  const target = event.target as HTMLDivElement;
  const type: string = target.dataset.type as string;
  createNewObject(event.clientX, event.clientY, type);
}

function calculateTopLeftCell(mousePos: Vector2): Vector2 | null {
  if (curDragItem.item == null) {
    return null;
  }

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
  currentTarget.style.opacity = opacity_moving;

  curDragItem.item = currentTarget;

  // Refree the cells below the item that has just started to be dragged
  {
    const size = curDragItem.item.getSize();

    let topLeft = new Vector2(0, 0);
    topLeft.x = Number(currentTarget.left);
    topLeft.y = Number(currentTarget.top);

    if (size == null) return;

    if (curDragItem.item.shouldLockCells) setCells(topLeft, size, false);

    highlightHoveredCells(topLeft, size, true);

    currentTarget.previousLeft = topLeft.x;
    currentTarget.previousTop = topLeft.y;
  }

  const pos = currentTarget.getScreenPosition();
  const diffX = pos.x - event.clientX;
  const diffY = pos.y - event.clientY;

  currentTarget.offsetX = diffX;
  currentTarget.offsetY = diffY;
  currentTarget.dontUpdatePosition = true;
  curDragItem.mouseX = event.clientX;
  curDragItem.mouseY = event.clientY;

}

function move(event: MouseEvent): void {
  if (curDragItem.item == null) {
    return;
  }

  const previousPos = calculateTopLeftCell(new Vector2(curDragItem.mouseX, curDragItem.mouseY));
  const size = curDragItem.item.getSize()

  if (previousPos == null || size == null) return;

  highlightHoveredCells(previousPos, size, false);

  curDragItem.item.style.left = (event.clientX + curDragItem.item.offsetX) + "px";
  curDragItem.item.style.top = (event.clientY + curDragItem.item.offsetY) + "px";
  curDragItem.mouseX = event.clientX;
  curDragItem.mouseY = event.clientY;

  const newPos = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));
  if (newPos == null) return;

  highlightHoveredCells(newPos, size, true);
}

function drop(event: MouseEvent): void {
  if (event.button != 0) { return }

  if (curDragItem.item == null) {
    return
  }

  const item = curDragItem.item;
  item.style.opacity = "100%";

  let topLeft = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));
  const size = item.getSize();

  if (topLeft == null || size == null) return;

  highlightHoveredCells(topLeft, size, false);

  // Check whether or not the item being dragged can be placed
  {
    if (item.shouldLockCells && !allValid(topLeft, size)) {
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
  if ((topLeft.x + size.x) * GRID_SIZE > grid.clientWidth || topLeft.x < 0 ||
    (topLeft.y + size.y) * GRID_SIZE > grid.clientHeight || topLeft.y < 0) {

    item.remove();
    curDragItem.item = null;
    if (item.shouldLockCells) {
      setCells(topLeft, size, false);
    }
    return;
  }

  item.hasBeenPlaced = true;
  item.left = topLeft.x;
  item.top = topLeft.y;
  item.dontUpdatePosition = false;

  item.updated();

  curDragItem.item = null;
}
