import { DraggableComponentElement } from "./DraggableElement";
import Vector2 from "./Vector2";

export var GRID_SIZE: number = 100;

const HIGHLIGHT_CELL: string = "highlighted-cell";

// String is json version of Vector2
let lockedCells: Set<string> = new Set<string>;
let currentCells: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>;

let canStartDragging: boolean = false;
let screenDragging: boolean = false;

let screenOffset: Vector2;
let initialDragLocation: Vector2;
let previousX: number;
let previousY: number;

const draggingStartLimit: number = 10.;
const sensitivity: number = 1.0;
const scroll_sensitivity: number = 0.1;

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

export function setupScreenHooks(): void {
  document.addEventListener("contextmenu", e => {
    // Disable screen wide context menu
    e.preventDefault();
  })

  document.addEventListener("mousedown", e => {
    if (e.button == 2) {
      initialDragLocation = new Vector2(e.clientX, e.clientY);
      canStartDragging = true;
    }
  })

  document.addEventListener("mouseup", e => {
    if (e.button == 2) {
      canStartDragging = false;
      screenDragging = false;
    }
  })

  screenOffset = new Vector2(0, 0);

  document.addEventListener("mousemove", e => {
    dragScreen(e.clientX, e.clientY);
  });

  document.addEventListener("wheel", e => {
    resizeScreen(e.deltaY * scroll_sensitivity);
  })

  document.addEventListener("touchstart", e => {
    switch (e.touches.length) {
      case 1:
        initialDragLocation = new Vector2(e.touches[0].clientX, e.touches[0].clientY);
        canStartDragging = true;
        break;
    }
  })

  document.addEventListener("touchmove", e => {
    switch (e.touches.length) {
      case 1:
        dragScreen(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
        break;
    }
  }, { passive: false });

  document.addEventListener("touchend", e => {
    switch (e.touches.length) {
      case 0:
        canStartDragging = false;
        screenDragging = false;
        break;
    }
  })
}

export function getScreenOffset(): Vector2 {
  return screenOffset;
}

export function resetScreenOffset(): void {
  screenOffset = new Vector2(0, 0);
  updateComponentPositions();
}

export function setScreenOffset(v: Vector2): void {
  screenOffset = v;
  updateComponentPositions();
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

function dragScreen(x: number, y: number): void {
  if (!canStartDragging) return;

  if (!screenDragging) {
    let dragDistance = Math.pow(x - initialDragLocation.x, 2.) + Math.pow(y - initialDragLocation.y, 2.);
    if (dragDistance < Math.pow(draggingStartLimit, 2.)) return;

    screenDragging = true;

    previousX = x;
    previousY = y;
  }

  if (screenDragging) {
    let diffX = (x - previousX) * sensitivity;
    let diffY = (y - previousY) * sensitivity;

    screenOffset.x += diffX
    screenOffset.y += diffY;

    updateComponentPositions();

    previousX = x;
    previousY = y;
  }
}

function resizeScreen(scale: number): void {
  GRID_SIZE += scale;
  updateComponentPositions();
}

function updateComponentPositions(): void {
  let components = document.getElementsByClassName("placed-component");
  for (let i = 0; i < components.length; i++) {
    const component = components[i] as DraggableComponentElement;
    let componentPos = component.getPosition();
    component.renderLeft = componentPos.x * GRID_SIZE + screenOffset.x;
    component.renderTop = componentPos.y * GRID_SIZE + screenOffset.y;
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
    if (lockedCells.has(JSON.stringify(pos))) {
      valid = false;
    }
  }

  mapCells(topLeft, size, func);

  return valid;
}

export function setCells(topLeft: Vector2, size: Vector2, fill: boolean): void {
  const func = (pos: Vector2) => {
    const posStr = JSON.stringify(pos);
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
    const posStr = JSON.stringify(pos);
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
