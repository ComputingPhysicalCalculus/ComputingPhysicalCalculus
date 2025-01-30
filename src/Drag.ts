import { ComponentType, createComponent, stringToComponent } from "./Components.ts"

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

  curDragItem.offsetX = -stripUnits(item.style.width) / 2;
  curDragItem.offsetY = -stripUnits(item.style.height) / 2;

  const posX: number = x + curDragItem.offsetX;
  const posY: number = y + curDragItem.offsetY;

  item.style.left = posX + "px";
  item.style.top = posY + "px";

  item.style.opacity = opacity_moving;

  item.addEventListener("mousedown", (event) => {
    const target = event.target as HTMLDivElement;
    target.style.opacity = opacity_moving;

    const diffX = stripUnits(target.style.left) - event.clientX;
    const diffY = stripUnits(target.style.top) - event.clientY;

    curDragItem.offsetX = diffX;
    curDragItem.offsetY = diffY;
    curDragItem.item = target;
  });

  document.getElementById("content")!.appendChild(item);
  draggableItems.push(item);
}

function mousePress(event: MouseEvent): void {
  console.log("Press");

  const target = event.target as HTMLDivElement;
  const type: string = target.dataset.type as string;
  createNewObject(event.clientX, event.clientY, type);
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
    comp.addEventListener("mousedown", mousePress);
  });

  document.addEventListener("mousemove", (event: MouseEvent) => {
    if (curDragItem.item == null) {
      return;
    }

    curDragItem.item.style.left = (event.clientX + curDragItem.offsetX) + "px";
    curDragItem.item.style.top = (event.clientY + curDragItem.offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    console.log("Mouse up");
    if (curDragItem.item != null) {
      curDragItem.item.style.opacity = "100%";
      curDragItem.item = null;
    }
  });
}
