import Vector2 from "./Vector2";

export const GRID_SIZE: number = 50;

const HIGHLIGHT_CELL: string = "highlighted-cell";

// String is json version of Vector2
let lockedCells: Set<string> = new Set<string>;
let currentCells: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>;

function createCell(col: number, row: number): HTMLDivElement {
  const comp = document.createElement("div");

  comp.classList.add("grid-cell");
  comp.id = new Vector2(col, row).toString();

  comp.style.left = (col * GRID_SIZE) + "px";
  comp.style.top = (row * GRID_SIZE) + "px";

  comp.style.width = GRID_SIZE + "px";
  comp.style.aspectRatio = "1";

  comp.dataset.col = "" + col;
  comp.dataset.row = "" + row;
  comp.dataset.filled = "0";

  return comp;
}

function mapCells(topLeft: Vector2, size: Vector2, func: (e: Vector2) => void): void {
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const pos = new Vector2(topLeft.x + x, topLeft.y + y);

      func(pos);
    }
  }
}

export function allValid(topLeft: Vector2, size: Vector2): boolean {

  let valid: boolean = true;
  const func = (pos: Vector2) => {
    if (lockedCells.has(pos.toString())) {
      valid = false;
    }
  }

  mapCells(topLeft, size, func);

  return valid;
}

export function setCells(topLeft: Vector2, size: Vector2, fill: boolean): void {
  const func = (pos: Vector2) => {
    const posStr = pos.toString();
    if (fill) {
      if (!lockedCells.has(posStr)) {
        lockedCells.add(posStr);
      }
    } else {
      if (lockedCells.has(posStr)) {
        lockedCells.delete(posStr);
      }
    }
  }

  mapCells(topLeft, size, func);
}

export function highlightHoveredCells(topLeft: Vector2, size: Vector2, highlight: boolean): void {
  mapCells(topLeft, size, (pos: Vector2) => {
    const posStr = pos.toString();
    if (highlight) {
      const cell = createCell(pos.x, pos.y);
      cell.classList.add(HIGHLIGHT_CELL);
      document.getElementById("grid")!.appendChild(cell);
      currentCells.set(posStr, cell);
    } else {
      if (currentCells.has(posStr)) {
        currentCells.get(posStr)?.remove();
        currentCells.delete(posStr);
      }
    }
  });
}
