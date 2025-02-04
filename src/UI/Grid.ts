import Vector2 from "./Vector2";

export const GRID_SIZE: number = 50;

const LOCKED_CELL: string = "locked-cell";
const HIGHLIGHT_CELL: string = "highlighted-cell";

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
  const grid = document.getElementById("grid") as HTMLDivElement;
  const totalWidth = grid.clientWidth;
  const totalHeight = grid.clientHeight;

  const cols = Math.ceil(totalWidth / GRID_SIZE);
  const rows = Math.ceil(totalHeight / GRID_SIZE);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const div = createCell(j, i);
      const pos = new Vector2(j, i);
      gridCells.set(pos.toString(), div);
      grid.appendChild(div);
    }
  }
}

function mapCells(topLeft: Vector2, size: Vector2, func: (e: HTMLDivElement) => void): void {
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const pos = new Vector2(topLeft.x + x, topLeft.y + y);
      const cell = gridCells.get(pos.toString());
      if (cell == undefined) {
        continue;
      }

      func(cell);
    }
  }
}

export function allValid(topLeft: Vector2, size: Vector2): boolean {

  let valid: boolean = true;
  const func = (cell: HTMLDivElement) => {
    if (cell.classList.contains(LOCKED_CELL)) valid = false;
  }

  mapCells(topLeft, size, func);

  return valid;
}

export function setCells(topLeft: Vector2, size: Vector2, filled: boolean): void {
  const func = (cell: HTMLDivElement) => {
    if (filled) {
      cell.classList.add(LOCKED_CELL);
    } else {
      cell.classList.remove(LOCKED_CELL);
    }
  }

  mapCells(topLeft, size, func);
}

export function highlightHoveredCells(topLeft: Vector2, size: Vector2, highlight: boolean): void {
  mapCells(topLeft, size, (cell: HTMLDivElement) => {
    if (highlight) {
      cell.classList.add(HIGHLIGHT_CELL);
    } else {
      cell.classList.remove(HIGHLIGHT_CELL);
    }
  });
}
