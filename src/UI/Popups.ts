import { DraggableComponentElement } from "./DraggableElement.ts";

let shaftPopup: HTMLDivElement;
let gearPopup: HTMLDivElement;
let multiplierPopup: HTMLDivElement;

export function setupPopups(): void {
  setupShaftPopup();
  setupGearPopup();
  setupMultiplierPopup();
}

function openPopup(e: MouseEvent, popup: HTMLDivElement): void {
  popup.style.visibility = "visible";
  popup.style.left = `${e.clientX + 10}px`;
  popup.style.top = `${e.clientY + 10}px`;
  popup.style.zIndex = "10";
}

export function openShaftPopup(e: MouseEvent): void {
  openPopup(e, shaftPopup);

  const target: DraggableComponentElement = e.currentTarget as DraggableComponentElement;
  const inputs = shaftPopup.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "0";
  }
  shaftPopup.dataset.id = target.id;

  e.preventDefault();
}

export function openGearPopup(e: MouseEvent): void {
  // TODO: Setup gear settings 
  openPopup(e, gearPopup);

  e.preventDefault();
}

export function openMultiplierPopup(e: MouseEvent): void {
  openPopup(e, multiplierPopup);

  e.preventDefault();
}

function closePopup(e: MouseEvent) {
  (e.currentTarget as HTMLDivElement).style.visibility = "hidden";
}

function setupShaftPopup(): void {
  shaftPopup = document.getElementById("shaft-popup") as HTMLDivElement;
  shaftPopup.addEventListener("mouseleave", closePopup);

  const buttons = shaftPopup.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.parentElement!.dataset.id!) as DraggableComponentElement;

      let negativeLength = 0;
      if (input.id == "shaft-popup-negative-increase") negativeLength = 1;
      if (input.id == "shaft-popup-negative-decrease") negativeLength = -1;

      let positiveLength = 0;
      if (input.id == "shaft-popup-positive-increase") positiveLength = 1;
      if (input.id == "shaft-popup-positive-decrease") positiveLength = -1;

      updateShaftLength(component, negativeLength, positiveLength);
    })
  }
}


function setupGearPopup(): void {
  gearPopup = document.getElementById("gear-popup") as HTMLDivElement;
  gearPopup.addEventListener("mouseleave", closePopup);
}

function setupMultiplierPopup(): void {
  multiplierPopup = document.getElementById("multiplier-popup") as HTMLDivElement;
  multiplierPopup.addEventListener("mouseleave", closePopup);
}

function updateShaftLength(comp: DraggableComponentElement, negativeLength: number, positiveLength: number) {
  const isVertical = comp.componentType == "vShaft";

  if (isVertical) {
    comp.top = comp.top - negativeLength;
    comp.height = Math.max(comp.height + negativeLength + positiveLength, 1);
  } else {
    comp.left = comp.left - negativeLength;
    comp.width = Math.max(comp.width + negativeLength + positiveLength, 1);
  }
}
