import { DraggableComponentElement } from "./DraggableElement.ts";
import { startedDragging } from "./Drag.ts";
import { screenDragging } from "./Grid.ts";
import Vector2 from "./Vector2.ts";
import { GRID_SIZE } from "./Grid.ts"
import { updateShaftLength } from "./Popups.ts";

const SELECTED_SHAFT = "selected";
const ARROW_PADDING = 0.05;

let selectedItem: DraggableComponentElement | null = null;
let currentArrow: HTMLImageElement | null = null;

let dragging = false;
let startPos: Vector2;

let negativeArrow: HTMLImageElement;
let positiveArrow: HTMLImageElement;

export function setupSelectHooks() {
    (document.querySelector("#machine")! as HTMLDivElement).addEventListener("click", endSelect);

    negativeArrow = document.querySelector("#negativeArrow")! as HTMLImageElement;
    positiveArrow = document.querySelector("#positiveArrow")! as HTMLImageElement;

    negativeArrow.addEventListener("mousedown", startDrag);
    positiveArrow.addEventListener("mousedown", startDrag);

    negativeArrow.addEventListener("dragstart", e => e.preventDefault());
    positiveArrow.addEventListener("dragstart", e => e.preventDefault());

    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", endDrag);
}

function startDrag(e: MouseEvent): void {
    if (!selectedItem) return;
    currentArrow = e.currentTarget as HTMLImageElement;
    dragging = true;

    startPos = new Vector2(e.clientX, e.clientY);
    document.body.style.cursor = "move";
    currentArrow.style.cursor = "move";
}

function moveDrag(e: MouseEvent): void {
    if (!dragging) return;
    let negativeDistance = 0;
    let positiveDistance = 0;
    if (selectedItem!.componentType == "hShaft") {
        if (Math.abs(e.clientX - startPos.x) >= GRID_SIZE * 0.6) {
            negativeDistance = (currentArrow!.id == "negativeArrow") ? (startPos.x - e.clientX) : 0
            positiveDistance = (currentArrow!.id == "positiveArrow") ? (e.clientX - startPos.x) : 0
            if (!(selectedItem!.width == 1 && (negativeDistance < 0 || positiveDistance < 0))) {
                const dist = Math.round(Math.max(Math.abs(positiveDistance), Math.abs(negativeDistance)) / GRID_SIZE);
                if (positiveDistance < 0 || negativeDistance > 0) {
                    startPos.x -= (GRID_SIZE * dist);
                } else {
                    startPos.x += (GRID_SIZE * dist);
                }
            }
        }
    } else {
        if (Math.abs(e.clientY - startPos.y) >= GRID_SIZE * 0.6) {
            negativeDistance = (currentArrow!.id == "negativeArrow") ? (startPos.y - e.clientY) : 0
            positiveDistance = (currentArrow!.id == "positiveArrow") ? (e.clientY - startPos.y) : 0
            if (!(selectedItem!.height == 1 && (negativeDistance < 0 || positiveDistance < 0))) {
                const dist = Math.round(Math.max(Math.abs(positiveDistance), Math.abs(negativeDistance)) / GRID_SIZE);
                if (positiveDistance < 0 || negativeDistance > 0) {
                    startPos.y -= (GRID_SIZE * dist);
                } else {
                    startPos.y += (GRID_SIZE * dist);
                }
            }
        }
    }

    if (negativeDistance != 0 || positiveDistance != 0) {
        updateShaftLength(selectedItem!, Math.round(negativeDistance / GRID_SIZE), Math.round(positiveDistance / GRID_SIZE))
        updateArrows();
    }
}

function endDrag(_e: MouseEvent): void {
    if (!dragging) return;

    dragging = false;

    document.body.style.cursor = "auto";
    currentArrow!.style.cursor = "pointer";

    currentArrow = null;
}

export function updateArrows(): void {
    if (!selectedItem) return;

    console.log("Move");

    const pos = selectedItem.getScreenPosition();
    const size = selectedItem.getScreenSize();

    if (selectedItem.componentType == "hShaft") {
        negativeArrow.style.rotate = "-90deg";
        positiveArrow.style.rotate = "90deg";

        negativeArrow.style.left = `${pos.x - negativeArrow.clientWidth - ARROW_PADDING * GRID_SIZE}px`;
        negativeArrow.style.top = `${pos.y + size.y / 2 - negativeArrow.clientHeight / 2}px`;
        positiveArrow.style.left = `${pos.x + size.x + ARROW_PADDING * GRID_SIZE}px`;
        positiveArrow.style.top = `${pos.y + size.y / 2 - positiveArrow.clientHeight / 2}px`;
    } else {
        negativeArrow.style.rotate = "0deg";
        positiveArrow.style.rotate = "180deg";

        negativeArrow.style.left = `${pos.x + size.x / 2 - negativeArrow.clientWidth / 2}px`;
        negativeArrow.style.top = `${pos.y - negativeArrow.clientHeight - ARROW_PADDING * GRID_SIZE}px`;
        positiveArrow.style.left = `${pos.x + size.x / 2 - positiveArrow.clientWidth / 2}px`;
        positiveArrow.style.top = `${pos.y + size.y + ARROW_PADDING * GRID_SIZE}px`;
    }

    negativeArrow.style.width = `${GRID_SIZE / 2}px`;
    negativeArrow.style.height = `${GRID_SIZE / 2}px`;
    positiveArrow.style.width = `${GRID_SIZE / 2}px`;
    positiveArrow.style.height = `${GRID_SIZE / 2}px`;
}

export function selectShaft(event: MouseEvent): void {
    if (event.button != 0) { return }
    if (startedDragging) return;

    clearSelect();

    const currentTarget = event.currentTarget as DraggableComponentElement;
    selectedItem = currentTarget;

    selectedItem.classList.add(SELECTED_SHAFT);

    updateArrows();

    negativeArrow.style.visibility = "visible";
    positiveArrow.style.visibility = "visible";
}

export function clearSelect(): void {
    if (!selectedItem) return;

    selectedItem.classList.remove(SELECTED_SHAFT);

    selectedItem = null;

    negativeArrow.style.visibility = "hidden";
    positiveArrow.style.visibility = "hidden";
}

export function endSelect(event: MouseEvent): void {
    if (event.button != 0) return;
    clearSelect();
}
