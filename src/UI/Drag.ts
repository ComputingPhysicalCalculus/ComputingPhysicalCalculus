import { ComponentType, createComponent, stringToComponent } from "./Components.ts"
import Vector2 from "./Vector2.ts"
import { GRID_SIZE, allValid, setCells, highlightHoveredCells } from "./Grid.ts";
import { DraggableComponentElement } from "./DraggableElement.ts";

// let components: Array<DraggableComponentElement> = new Array<DraggableComponentElement>;
// let draggableItems: Array<DraggableComponentElement> = new Array<DraggableComponentElement>;

type DragItem = {
  item: DraggableComponentElement | null,
  offsetX: number,
  offsetY: number,

  mouseX: number,
  mouseY: number,
};

let curDragItem: DragItem = { item: null, offsetX: 0, offsetY: 0 };

const opacity_moving: string = "10%";

function stripUnits(value: string): number {
  return Number(value.substring(0, value.length - 2));
}

function createNewObject(x: number, y: number, typeString: string): void {
  const componentType: ComponentType | null = stringToComponent(typeString);

  if (componentType == null)
    return;

  const item = createComponent(componentType);
  curDragItem.item = item;

  // +1 to prevent being perfecttly centered
  curDragItem.offsetX = -stripUnits(item.style.width) / 2 + 1;
  curDragItem.offsetY = -stripUnits(item.style.height) / 2 + 1;

  const posX: number = x + curDragItem.offsetX;
  const posY: number = y + curDragItem.offsetY;

  item.style.left = posX + "px";
  item.style.top = posY + "px";

  item.style.opacity = opacity_moving;

  item.dataset.hasBeenPlaced = "0";

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

  const offX = Math.floor(-curDragItem.offsetX / GRID_SIZE);
  const offY = Math.floor(-curDragItem.offsetY / GRID_SIZE);

  const placementCol = currentMouseCol - offX;
  const placementRow = currentMouseRow - offY;

  return new Vector2(placementCol, placementRow);
}

function getSize(): Vector2 | null {
  if (curDragItem.item == null) {
    return null;
  }

  const width = curDragItem.item.width;
  const height = curDragItem.item.height;

  return new Vector2(width, height);
}

export function pickup(event: MouseEvent): void {
  if (event.button != 0) { return }

  const currentTarget = event.currentTarget as DraggableComponentElement;
  currentTarget.style.opacity = opacity_moving;

  curDragItem.item = currentTarget;

  // Refree the cells below the item that has just started to be dragged
  {
    const size = getSize();
    // const topLeft = calculateTopLeftCell(new Vector2(.currentTarget.clientLeft, .currentTarget.clientTop));

    let topLeft = new Vector2(0, 0);
    topLeft.x = Number(currentTarget.dataset.topLeftX);
    topLeft.y = Number(currentTarget.dataset.topLeftY);

    if (size == null) return;

    setCells(topLeft, size, false);

    currentTarget.dataset.previousCol = topLeft.x + "";
    currentTarget.dataset.previousRow = topLeft.y + "";
  }

  const diffX = stripUnits(currentTarget.style.left) - event.clientX;
  const diffY = stripUnits(currentTarget.style.top) - event.clientY;

  curDragItem.offsetX = diffX;
  curDragItem.offsetY = diffY;
  curDragItem.mouseX = event.clientX;
  curDragItem.mouseY = event.clientY;
}

function move(event: MouseEvent): void {
  if (curDragItem.item == null) {
    return;
  }

  const previousPos = calculateTopLeftCell(new Vector2(curDragItem.mouseX, curDragItem.mouseY));
  const size = getSize()

  if (previousPos == null || size == null) return;

  highlightHoveredCells(previousPos, size, false);

  curDragItem.item.style.left = (event.clientX + curDragItem.offsetX) + "px";
  curDragItem.item.style.top = (event.clientY + curDragItem.offsetY) + "px";
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
  const size = getSize();

  if (topLeft == null || size == null) return;

  highlightHoveredCells(topLeft, size, false);

  // Check whether or not the item being dragged can be placed
  {
    if (!allValid(topLeft, size)) {
      if (item.dataset.hasBeenPlaced == "0") {
        item.remove();
        curDragItem.item = null;
        return;
      }

      topLeft.x = Number(item.dataset.previousCol);
      topLeft.y = Number(item.dataset.previousRow);
    }

    setCells(topLeft, size, true);
  }

  item.style.left = (topLeft.x * GRID_SIZE) + "px";
  item.style.top = (topLeft.y * GRID_SIZE) + "px";

  const grid = document.getElementById("grid") as HTMLDivElement;
  if ((topLeft.x + size.x) * GRID_SIZE > grid.clientWidth || topLeft.x < 0 ||
    (topLeft.y + size.y) * GRID_SIZE > grid.clientHeight || topLeft.y < 0) {

    item.remove();
    curDragItem.item = null;
    setCells(topLeft, size, false);
    return;
  }

  item.dataset.hasBeenPlaced = "1";
  item.dataset.topLeftX = topLeft.x + "";
  item.dataset.topLeftY = topLeft.y + "";

  curDragItem.item = null;
}
