import Vector2 from "./Vector2";

export const GRID_SIZE: number = 50;

// String is json version of Vector2
let gridCells: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>;

function createCell(col: number, row: number): HTMLDivElement {
  const comp = document.createElement("div");

  comp.classList.add("grid-cell");

  comp.style.left = (col * GRID_SIZE) + "px";
  comp.style.top = (row * GRID_SIZE) + "px";

  comp.style.width = GRID_SIZE + "px";
  comp.style.aspectRatio = "1";

  comp.dataset.col = "" + col;
  comp.dataset.row = "" + row;
  comp.dataset.filled = "0";

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
      const pos = new Vector2(j, i);
      gridCells.set(pos.toString(), div);
      machine.appendChild(div);
    }
  }
}

export function allValid(topLeft: Vector2, size: Vector2): boolean {
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const pos = new Vector2(topLeft.x + x, topLeft.y + y);
      const cell = gridCells.get(pos.toString());
      if (cell == undefined) {
        continue;
      }

      if (cell.dataset.filled == "1") {
        return false;
      }
    }
  }

  return true;
}

export function setCells(topLeft: Vector2, size: Vector2, filled: boolean): void {
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const pos = new Vector2(topLeft.x + x, topLeft.y + y);
      const cell = gridCells.get(pos.toString());
      if (cell == undefined) {
        continue;
      }

      cell.dataset.filled = String(Number(filled));
    }
  }
}
