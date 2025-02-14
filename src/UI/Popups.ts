import { DraggableComponentElement } from "./DraggableElement.ts";
import { currentlyDragging, GRID_SIZE, worldToScreenPosition } from "./Grid.ts";
import Vector2 from "./Vector2.ts";
import { GearPairComponentElement } from "./GearPairComponentElement.ts";
import Expression from "@src/expr/Expression.ts";
import { GraphElement } from "./GraphElement.ts";

import { generator } from "../index.ts";

let shaftPopup: HTMLDivElement;
let crossConnectPopup: HTMLDivElement;
let integratorPopup: HTMLDivElement;
let motorPopup: HTMLDivElement;
let multiplierPopup: HTMLDivElement;
let gearPairPopup: HTMLDivElement;
let functionTablePopup: HTMLDivElement;
let outputTablePopup: HTMLDivElement;

export function setupPopups(): void {
  setupShaftPopup();
  setupCrossConnectPopup();
  setupIntegratorPopup();
  setupMotorPopup();
  setupMultiplierPopup();
  setupGearPairPopup();
  setupFunctionTablePopup();
  setupOutputTablePopup();

  document.addEventListener("click", documentClick);
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
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, shaftPopup);

  const target = e.currentTarget as DraggableComponentElement;
  const isVertical = target.componentType == "vShaft";

  const labels = shaftPopup.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    const input = labels[i] as HTMLLabelElement;

    if (input.id == "shaft-negative-label") {
      input.innerText = (isVertical) ? "Top Length" : "Left Length";
    } else if (input.id == "shaft-positive-label") {
      input.innerText = (isVertical) ? "Bottom Length" : "Right Length";
    }
  }

  e.preventDefault();
}

export function openCrossConnectPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, crossConnectPopup);

  const target = e.currentTarget as DraggableComponentElement;
  const checkbox = crossConnectPopup.querySelector("input") as HTMLInputElement;
  checkbox.checked = target.outputRatio < 0;

  e.preventDefault();
}

export function openIntegratorPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, integratorPopup);

  const target = e.currentTarget as DraggableComponentElement;

  integratorPopup.getElementsByTagName("input")[0].value = String(target.inputRatio);

  e.preventDefault();
}

export function openFunctionTablePopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, functionTablePopup);

  const target = e.currentTarget as DraggableComponentElement;
  const graph_element = target.querySelector("graph-table") as GraphElement;

  functionTablePopup.getElementsByTagName("input")[0].value = graph_element.data_sets["1"]?.fn ?? "";

  e.preventDefault();
}

export function openOutputTablePopup(e: MouseEvent): void {
  if (currentlyDragging()) return;

  openPopup(e, outputTablePopup);

  const target = e.currentTarget as DraggableComponentElement;
  const graph_element = target.querySelector("graph-table") as GraphElement;

  let inputs = outputTablePopup.getElementsByTagName("input");
  inputs[0].value = String(target.inputRatio);
  inputs[1].value = String(target.outputRatio);
  inputs[2].value = String(graph_element.x_min);
  inputs[3].value = String(graph_element.x_max);
  inputs[4].value = String(graph_element.y_min);
  inputs[5].value = String(graph_element.y_max);

  e.preventDefault();
}

export function openMotorPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, motorPopup);

  const target = e.currentTarget as DraggableComponentElement;

  if (target.outputRatio < 0) {
    motorPopup.getElementsByTagName("input")[0].checked = true;
  } else {
    motorPopup.getElementsByTagName("input")[0].checked = false;
  }

  e.preventDefault();
}

export function openMultiplierPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, multiplierPopup);

  const target = e.currentTarget as DraggableComponentElement;
  multiplierPopup.getElementsByTagName("input")[0].value = String(target.outputRatio);

  e.preventDefault();
}

export function openGearPairPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, gearPairPopup);

  const target = (e.currentTarget as HTMLElement).querySelector("gear-pair-component") as GearPairComponentElement;
  const inputs = gearPairPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i] as HTMLInputElement;
    if (input.id == "gear-pair-top-ratio") {
      input.value = String(target.ratio_top);
    }
    else if (input.id == "gear-pair-bottom-ratio") {
      input.value = String(target.ratio_bottom);
    }
  }

  e.preventDefault();
}


function closePopup(e: MouseEvent) {
  (e.currentTarget as HTMLDivElement).style.visibility = "hidden";
}

function mouseWithin(popup: HTMLDivElement, e: MouseEvent): boolean {
  if (popup.style.visibility == "hidden") return false;

  let left_style = popup.style.left;
  let top_style = popup.style.top;

  let left = Number(left_style.substring(0, left_style.length - 2));
  let top = Number(top_style.substring(0, top_style.length - 2));

  if (e.clientX > left && e.clientX < left + popup.clientWidth &&
    e.clientY > top && e.clientY < top + popup.clientHeight) {
    return true;
  }
  return false;
}

function documentClick(e: MouseEvent) {
  let popups = [shaftPopup, crossConnectPopup, integratorPopup, motorPopup, multiplierPopup, gearPairPopup,];
  popups.forEach(popup => {
    if (!mouseWithin(popup, e)) {
      popup.style.visibility = "hidden";
    }
  });
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

function setupCrossConnectPopup(): void {
  crossConnectPopup = document.getElementById("cross-connect-popup") as HTMLDivElement;
  crossConnectPopup.addEventListener("mouseleave", closePopup);

  const inputs = crossConnectPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

      if (input.checked)
        component.outputRatio = -1;
      else
        component.outputRatio = 1;

      component.querySelector("cross-connect-component")!.inverted = input.checked;
    });
  }
}

function setupIntegratorPopup(): void {
  integratorPopup = document.getElementById("integrator-popup") as HTMLDivElement;
  integratorPopup.addEventListener("mouseleave", closePopup);

  const inputs = integratorPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

      component.inputRatio = Number(input.value);
    })
  }
}

function setupMotorPopup(): void {
  motorPopup = document.getElementById("motor-popup") as HTMLDivElement;
  motorPopup.addEventListener("mouseleave", closePopup);

  const inputs = motorPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

      if (input.checked)
        component.outputRatio = -1;
      else
        component.outputRatio = 1;
    })
  }
}

function setupMultiplierPopup(): void {
  multiplierPopup = document.getElementById("multiplier-popup") as HTMLDivElement;
  multiplierPopup.addEventListener("mouseleave", closePopup);

  const inputs = multiplierPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

      component.outputRatio = Number(input.value);
    })
  }
}

function setupGearPairPopup(): void {
  gearPairPopup = document.getElementById("gear-pair-popup") as HTMLDivElement;
  gearPairPopup.addEventListener("mouseleave", closePopup);

  const inputs = gearPairPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      // const component = document.getElementById(input.parentElement!.parentElement!.dataset.id!) as DraggableComponentElement;
      const component = document.querySelector(`#${input.parentElement!.dataset.id!} > gear-pair-component`) as GearPairComponentElement;

      if (input.id == "gear-pair-top-ratio") {
        component.ratio_top = Math.min(Math.max(Number(input.value), 1), 9);
        input.value = String(component.ratio_top);
      } else if (input.id == "gear-pair-bottom-ratio") {
        component.ratio_bottom = Math.min(Math.max(Number(input.value), 1), 9);
        input.value = String(component.ratio_bottom);
      }
    })
  }
}

function setupFunctionTablePopup(): void {
  functionTablePopup = document.getElementById("function-table-popup") as HTMLDivElement;
  functionTablePopup.addEventListener("mouseleave", closePopup);

  const inputs = functionTablePopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.querySelector(`#${input.parentElement!.dataset.id!} > graph-table`) as GraphElement;

      if (input.id == "function-table-fn") {
        let compiled_expr = Expression.compile(input.value);
        let generator_exp = generator(500, component.x_min, component.x_max, x => compiled_expr({ x }));
        component.set_data_set("1", Array.from([...generator_exp]));
        component.data_sets["1"].fn = input.value;
      }
    })
  }
}

function setupOutputTablePopup(): void {
  outputTablePopup = document.getElementById("output-table-popup") as HTMLDivElement;
  outputTablePopup .addEventListener("mouseleave", closePopup);

  const inputs = outputTablePopup.querySelectorAll("* > input");
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!}`) as DraggableComponentElement;
      const component_graph = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > graph-table`) as GraphElement;

      switch (input.id) {
        case "output-table-initial-1":
          component.inputRatio = Number(input.value);
          break;
        case "output-table-initial-2":
          component.outputRatio = Number(input.value);
          break;
        case "output-table-x-min":
          component_graph.x_min = Number(input.value);
          break;
        case "output-table-x-max":
          component_graph.x_max = Number(input.value);
          break;
        case "output-table-y-min":
          component_graph.y_min = Number(input.value);
          break;
        case "output-table-y-max":
          component_graph.y_max = Number(input.value);
          break;
      }
    })
  }
}

function updateShaftLength(comp: DraggableComponentElement, negativeLength: number, positiveLength: number) {
  const isVertical = comp.componentType == "vShaft";

  if (isVertical) {
    if (comp.height == 1 && (negativeLength == -1 || positiveLength == -1)) return;
    comp.top = comp.top - negativeLength;
    comp.height = Math.max(comp.height + negativeLength + positiveLength, 1);
  } else {
    if (comp.width == 1 && (negativeLength == -1 || positiveLength == -1)) return;
    comp.left = comp.left - negativeLength;
    comp.width = Math.max(comp.width + negativeLength + positiveLength, 1);
  }
  let screenPosition = worldToScreenPosition(new Vector2(comp.left * GRID_SIZE, comp.top * GRID_SIZE));
  comp.renderLeft = screenPosition.x;
  comp.renderTop = screenPosition.y;
}
