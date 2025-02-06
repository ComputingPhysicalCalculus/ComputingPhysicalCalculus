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

  const target: DraggableComponentElement = e.currentTarget as DraggableComponentElement;
  popup.dataset.id = target.id;
}

export function openShaftPopup(e: MouseEvent): void {
  openPopup(e, shaftPopup);

  e.preventDefault();
}

export function openGearPopup(e: MouseEvent): void {
  openPopup(e, gearPopup);

  const target = e.currentTarget as DraggableComponentElement;
  const inputs = gearPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i] as HTMLInputElement;
    if (input.id == "gear-input-ratio") {
      input.value = String(target.inputRatio);
    }
    else if (input.id == "gear-output-ratio") {
      input.value = String(target.outputRatio);
    }
  }

  e.preventDefault();
}

export function openMultiplierPopup(e: MouseEvent): void {
  openPopup(e, multiplierPopup);

  const target = e.currentTarget as DraggableComponentElement;
  multiplierPopup.getElementsByTagName("input")[0].value = String(target.outputRatio);

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
      const button: HTMLButtonElement = e.currentTarget as HTMLButtonElement;
      const component = document.getElementById(button.parentElement!.parentElement!.dataset.id!) as DraggableComponentElement;

      let negativeLength = 0;
      if (button.id == "shaft-popup-negative-increase") negativeLength = 1;
      if (button.id == "shaft-popup-negative-decrease") negativeLength = -1;

      let positiveLength = 0;
      if (button.id == "shaft-popup-positive-increase") positiveLength = 1;
      if (button.id == "shaft-popup-positive-decrease") positiveLength = -1;

      updateShaftLength(component, negativeLength, positiveLength);
    });
  }
}


function setupGearPopup(): void {
  gearPopup = document.getElementById("gear-popup") as HTMLDivElement;
  gearPopup.addEventListener("mouseleave", closePopup);

  const inputs = gearPopup.getElementsByTagName("input");
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.parentElement!.dataset.id!) as DraggableComponentElement;

      if (input.id == "gear-input-ratio") {
        component.inputRatio = Number(input.value);
      } else if (input.id == "gear-output-ratio") {
        component.outputRatio = Number(input.value);
      }
    })
  }
}

function setupMultiplierPopup(): void {
  multiplierPopup = document.getElementById("multiplier-popup") as HTMLDivElement;
  multiplierPopup.addEventListener("mouseleave", closePopup);

  const inputs = multiplierPopup.getElementsByTagName("input");
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

      component.outputRatio = Number(input.value);
    })
  }
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
