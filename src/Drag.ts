let components: Array<HTMLDivElement>;

const DRAG_WIDTH: number = 100;
const DRAG_HEIGHT: number = 100;

let dragItem: HTMLDivElement | null;

const opacity_moving: string = "10%";

function createNewObject(x: number, y: number, id: number): void {
  console.log("Create new");
  dragItem = document.createElement("div");

  // dragItem.addEventListener("dragstart", dragStart);
  // dragItem.addEventListener("dragend", dragEnd);

  const posX: number = x - DRAG_WIDTH / 2;
  const posY: number = y - DRAG_HEIGHT / 2;

  dragItem.id = "draggingComponent";

  dragItem.style.position = "absolute";
  dragItem.style.left = posX + "px";
  dragItem.style.top = posY + "px";
  dragItem.style.top = "absolute";

  const COLOURS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
  dragItem.style.background = COLOURS[id];
  dragItem.style.width = DRAG_WIDTH + "px";
  dragItem.style.height = DRAG_HEIGHT + "px";

  dragItem.style.opacity = opacity_moving;

  dragItem.addEventListener("mousedown", (event) => {
    const target = event.target as HTMLDivElement;
    target.style.opacity = opacity_moving;
    dragItem = target;
  });

  document.getElementById("content")!.appendChild(dragItem);

}

function mousePress(event: MouseEvent): void {
  console.log("Press");

  const target = event.target as HTMLDivElement;
  const id = Number(target.innerHTML);
  createNewObject(event.clientX, event.clientY, id - 1);
}


export function setupDragHooks(): void {
  console.log("Hello, World");

  components = new Array<HTMLDivElement>;

  const list = document.querySelectorAll('.component');
  list.forEach(element => {
    components.push(element as HTMLDivElement);
  });

  components.forEach(comp => {
    comp.addEventListener("mousedown", mousePress);
  });

  document.addEventListener("mousemove", (event: MouseEvent) => {
    if (dragItem == null) {
      return;
    }

    dragItem.style.left = (event.clientX - DRAG_WIDTH / 2) + "px";
    dragItem.style.top = (event.clientY - DRAG_HEIGHT / 2) + "px";
  });

  document.addEventListener("mouseup", () => {
    console.log("Mouse up");
    if (dragItem != null) {
      dragItem.style.opacity = "100%";
      dragItem = null;
      // dragItem.remove(); // Removes item
    }
  });
}
