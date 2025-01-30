import { ComponentType, createComponent, stringToComponent } from "./Components.ts"
import { GRID_SIZE } from "./Grid.ts";

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

  item.addEventListener("mousedown", pickup);
  document.getElementById("content")!.appendChild(item);
  draggableItems.push(item);
}


export function setupDragHooks(): void {
  console.log("Hello, World");

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

function pickup(event: MouseEvent): void {
  const target = event.target as HTMLDivElement;
  target.style.opacity = opacity_moving;

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

  let currentMouseCol = Math.floor(event.clientX / GRID_SIZE);
  let currentMouseRow = Math.floor(event.clientY / GRID_SIZE);

  Math.floor(curDragItem.offsetX)

  const offX = Math.floor(-curDragItem.offsetX / GRID_SIZE);
  const offY = Math.floor(-curDragItem.offsetY / GRID_SIZE);

  item.style.left = ((currentMouseCol - offX) * GRID_SIZE) + "px";
  item.style.top = ((currentMouseRow - offY) * GRID_SIZE) + "px";

  console.log("Current Row: " + currentMouseRow + " Current Col: " + currentMouseCol + " Off X: " + offX + " Off Y: " + offY);

  curDragItem.item = null;
}

