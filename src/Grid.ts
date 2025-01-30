import Vector2 from "./Vector2";

export const GRID_SIZE: number = 50;

let gridCells: Map<Vector2, HTMLDivElement> = new Map<Vector2, HTMLDivElement>;

function createCell(col: number, row: number): HTMLDivElement {
  const comp = document.createElement("div");

  comp.classList.add("grid-cell");

  comp.style.left = (col * GRID_SIZE) + "px";
  comp.style.top = (row * GRID_SIZE) + "px";

  comp.style.width = GRID_SIZE + "px";
  comp.style.aspectRatio = "1";

  comp.dataset.col = "" + col;
  comp.dataset.row = "" + row;

  return comp;
}

export function createGrid(): void {
  const machine = document.getElementById("machine") as HTMLDivElement;
  const totalWidth = machine.clientWidth;
  const totalHeight = machine.clientHeight;

  const cols = Math.ceil(totalWidth / GRID_SIZE);
  const rows = Math.ceil(totalHeight / GRID_SIZE);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const div = createCell(j, i);
      gridCells.set(new Vector2(j, i), div);
      machine.appendChild(div);
    }
  }
}
