import { ComponentType, createComponent, stringToComponent } from "./Components.ts"
import Vector2 from "./Vector2.ts"
import { GRID_SIZE, allValid, setCells } from "./Grid.ts";

let components: Array<HTMLDivElement> = new Array<HTMLDivElement>;
let draggableItems: Array<HTMLDivElement> = new Array<HTMLDivElement>;

type DragItem = {
  item: HTMLDivElement | null,
  offsetX: number,
  offsetY: number
};

let curDragItem: DragItem = { item: null, offsetX: 0, offsetY: 0 };


// let dragItem: HTMLDivElement | null;

const opacity_moving: string = "10%";

function stripUnits(value: string): number {
  return Number(value.substring(0, value.length - 2));
}

function createNewObject(x: number, y: number, typeString: string): void {
  const componentType: ComponentType | null = stringToComponent(typeString);

  if (componentType == null)
    return;

  const item: HTMLDivElement = createComponent(componentType);
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

  item.addEventListener("mousedown", pickup);
  document.getElementById("content")!.appendChild(item);
  draggableItems.push(item);
}


export function setupDragHooks(): void {
  components = new Array<HTMLDivElement>;
  draggableItems = new Array<HTMLDivElement>;

  const list = document.querySelectorAll('.component');
  list.forEach(element => {
    components.push(element as HTMLDivElement);
  });

  components.forEach(comp => {
    comp.addEventListener("mousedown", creation);
  });

  document.addEventListener("mousemove", (event: MouseEvent) => {
    if (curDragItem.item == null) {
      return;
    }

    curDragItem.item.style.left = (event.clientX + curDragItem.offsetX) + "px";
    curDragItem.item.style.top = (event.clientY + curDragItem.offsetY) + "px";
  });

  document.addEventListener("mouseup", drop);
}

function creation(event: MouseEvent): void {
  const target = event.target as HTMLDivElement;
  const type: string = target.dataset.type as string;
  createNewObject(event.clientX, event.clientY, type);
}

function calculateTopLeftCell(mousePos: Vector2): Vector2 {
  let currentMouseCol = Math.floor(mousePos.x / GRID_SIZE);
  let currentMouseRow = Math.floor(mousePos.y / GRID_SIZE);

  const offX = Math.floor(-curDragItem.offsetX / GRID_SIZE);
  const offY = Math.floor(-curDragItem.offsetY / GRID_SIZE);

  const placementCol = currentMouseCol - offX;
  const placementRow = currentMouseRow - offY;

  return new Vector2(placementCol, placementRow);
}

function pickup(event: MouseEvent): void {
  const target = event.target as HTMLDivElement;
  target.style.opacity = opacity_moving;

  // Refree the cells below the item that has just started to be dragged
  {
    const width = Number(target.dataset.width);
    const height = Number(target.dataset.height);

    const topLeft = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));
    const size = new Vector2(width, height);

    setCells(topLeft, size, false);

    target.dataset.previousCol = topLeft.x + "";
    target.dataset.previousRow = topLeft.y + "";
  }

  const diffX = stripUnits(target.style.left) - event.clientX;
  const diffY = stripUnits(target.style.top) - event.clientY;

  curDragItem.offsetX = diffX;
  curDragItem.offsetY = diffY;
  curDragItem.item = target;
}

function drop(event: MouseEvent): void {
  if (curDragItem.item == null) {
    return
  }

  const item = curDragItem.item;
  item.style.opacity = "100%";

  let topLeft = calculateTopLeftCell(new Vector2(event.clientX, event.clientY));

  const width = Number(item.dataset.width);
  const height = Number(item.dataset.height);

  // Check whether or not the item being dragged can be placed
  {

    const size = new Vector2(width, height);
    if (!allValid(topLeft, size)) {
      if (item.dataset.hasBeenPlaced == "0") {
        item.remove();
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
  if ((topLeft.x + width) * GRID_SIZE > grid.clientWidth || topLeft.x < 0 ||
    (topLeft.y + height) * GRID_SIZE > grid.clientHeight || topLeft.y < 0) {

    item.remove();
  }

  item.dataset.hasBeenPlaced = "1";

  curDragItem.item = null;
}
