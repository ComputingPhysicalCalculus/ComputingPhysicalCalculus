import { DraggableComponentElement } from "./DraggableElement";
import Vector2 from "./Vector2";

export const GRID_SIZE: number = 50;

const HIGHLIGHT_CELL: string = "highlighted-cell";

// String is json version of Vector2
let lockedCells: Set<string> = new Set<string>;
let currentCells: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>;

let rightMouseDown: boolean = false;
let screenDragging: boolean = false;

let screenOffset: Vector2;
let previousX: number;
let previousY: number;

const draggingStartLimit: number = 20.;
const sensitivity: number = 1.0;

function createCell(col: number, row: number): HTMLDivElement {
  const comp = document.createElement("div");

  comp.classList.add("grid-cell");
  comp.id = new Vector2(col, row).toString();

  let top_left = worldToScreenPosition(new Vector2(col * GRID_SIZE, row * GRID_SIZE));
  comp.style.left = top_left.x + "px";
  comp.style.top = top_left.y + "px";

  comp.style.width = GRID_SIZE + "px";
  comp.style.aspectRatio = "1";

  comp.dataset.col = "" + col;
  comp.dataset.row = "" + row;
  comp.dataset.filled = "0";

  return comp;
}

export function setupScreenDrag(): void {
  document.addEventListener("contextmenu", e => {
    // Disable screen wide context menu
    e.preventDefault();
  })

  document.addEventListener("mousedown", e => {
    if (e.button == 2) {
      rightMouseDown = true;
    }
  })

  document.addEventListener("mouseup", e => {
    if (e.button == 2) {
      rightMouseDown = false;
      screenDragging = false;
    }
  })

  screenOffset = new Vector2(0, 0);

  document.addEventListener("mousemove", dragScreen);
}

export function getScreenOffset(): Vector2 {
  return screenOffset;
}

export function resetScreenOffset(): void {
  screenOffset = new Vector2(0, 0);
}

export function screenToWorldPosition(pos: Vector2): Vector2 {
  let ret = new Vector2(0, 0);
  ret.x = pos.x - screenOffset.x;
  ret.y = pos.y - screenOffset.y;

  return ret;
}

export function worldToScreenPosition(pos: Vector2): Vector2 {
  let ret = new Vector2(0, 0);
  ret.x = pos.x + screenOffset.x;
  ret.y = pos.y + screenOffset.y;

  return ret;
}

function dragScreen(event: MouseEvent): void {
  if (!rightMouseDown) return;

  if (!screenDragging && Math.abs(event.offsetX) + Math.abs(event.offsetY) > draggingStartLimit) {
    screenDragging = true;

    previousX = event.clientX;
    previousY = event.clientY;
  }

  if (screenDragging) {

    let diffX = (event.clientX - previousX) * sensitivity;
    let diffY = (event.clientY - previousY) * sensitivity;

    screenOffset.x += diffX
    screenOffset.y += diffY;

    let components = document.getElementsByClassName("placed-component");
    for (let i = 0; i < components.length; i++) {
      const component = components[i] as DraggableComponentElement;
      component.renderLeft += diffX;
      component.renderTop += diffY;
    }

    previousX = event.clientX;
    previousY = event.clientY;
  }
}

function mapCells(topLeft: Vector2, size: Vector2, func: (e: Vector2) => void): void {
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      const pos = new Vector2(topLeft.x + x, topLeft.y + y);

      func(pos);
    }
  }
}

export function currentlyDragging() { return screenDragging; }

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
