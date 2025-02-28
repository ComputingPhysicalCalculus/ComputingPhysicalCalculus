import { DraggableComponentElement } from "./DraggableElement.ts";
import { currentlyDragging, GRID_SIZE, worldToScreenPosition } from "./Grid.ts";
import Vector2 from "./Vector2.ts";
import { GearPairComponentElement } from "./GearPairComponentElement.ts";
import Expression from "@src/expr/Expression.ts";
import { GraphElement } from "./GraphElement.ts";
import { clearSelect } from "./SelectShaft.ts"

import { generator } from "../index.ts";
import { CrossConnectComponentElement } from "./CrossConnectComponentElement.ts";
import { machine } from "./Constants.ts";
import { get_global_ctx } from "@src/Lifecycle.ts";

const MIN_TEXT_AREA_LINES = 3;
const MAX_TEXT_AREA_LINES = 10;

let crossConnectPopup: HTMLDivElement;
let integratorPopup: HTMLDivElement;
let multiplierPopup: HTMLDivElement;
let gearPairPopup: HTMLDivElement;
let functionTablePopup: HTMLDivElement;
let outputTablePopup: HTMLDivElement;
let labelPopup: HTMLDivElement;

// Sets up each type of popup
// The setup involves adding event handlers for change events and correctly updating the 
// correct component
export function setupPopups(): void {
  setupCrossConnectPopup();
  setupIntegratorPopup();
  setupMultiplierPopup();
  setupGearPairPopup();
  setupFunctionTablePopup();
  setupOutputTablePopup();
  setupLabelPopup();

  machine.addEventListener("click", documentClick);
}

// Default code for opening a popup near to the mouse
// Opens above the mouse if the popup will be displayed outside the document
function openPopup(e: MouseEvent, popup: HTMLDivElement): void {
  closeAllPopups();

  const gap = 8;
  popup.style.visibility = "visible";
  popup.style.left = `${e.clientX + gap}px`;
  let top = e.clientY + gap;
  if (top + popup.clientHeight > document.body.clientHeight) {
    top = e.clientY - popup.clientHeight - gap;
  }
  popup.style.top = `${top}px`;
  popup.style.zIndex = "10";

  const target: DraggableComponentElement = e.currentTarget as DraggableComponentElement;
  popup.dataset.id = target.id;

  clearSelect();
}

export function openCrossConnectPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, crossConnectPopup);

  const target = (e.currentTarget as DraggableComponentElement).querySelector("cross-connect-component") as CrossConnectComponentElement;
  const checkbox = crossConnectPopup.querySelector("input") as HTMLInputElement;
  checkbox.checked = target.inverted;

  e.preventDefault();
}

export function openIntegratorPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, integratorPopup);

  const target = e.currentTarget as DraggableComponentElement;

  updateTextAreaLines(functionTablePopup.querySelector("textarea")!);

  integratorPopup.getElementsByTagName("textarea")[0].value = String(target.dataset.initialValue ?? "0");

  e.preventDefault();
}

export function openFunctionTablePopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, functionTablePopup);

  const target = e.currentTarget as DraggableComponentElement;
  const graph_element = target.querySelector("graph-table") as GraphElement;

  const text_area = functionTablePopup.querySelector("textarea")!;
  text_area.value = graph_element.data_sets["d1"].fn ?? "";

  // Count the number of newlines in the input text to set the correct height of the
  // textarea
  updateTextAreaLines(text_area);

  let inputs = functionTablePopup.getElementsByTagName("input");
  inputs[0].value = target.dataset.x_min ?? String(graph_element.x_min);
  inputs[1].value = target.dataset.x_max ?? String(graph_element.x_max);
  inputs[2].value = target.dataset.y_min ?? String(graph_element.y_min);
  inputs[3].value = target.dataset.y_max ?? String(graph_element.y_max);
  inputs[4].checked = (!target.dataset.lookup) ? false : (target.dataset.lookup == "1");

  e.preventDefault();
}

export function openOutputTablePopup(e: MouseEvent): void {
  if (currentlyDragging()) return;

  openPopup(e, outputTablePopup);

  const target = e.currentTarget as DraggableComponentElement;
  const graph_element = target.querySelector("graph-table") as GraphElement;

  let inputs = outputTablePopup.getElementsByTagName("input");
  inputs[0].value = target.dataset.initial_1 ?? String(target.inputRatio);
  inputs[1].value = target.dataset.initial_2 ?? String(target.outputRatio);
  inputs[2].value = target.dataset.x_min ?? String(graph_element.x_min);
  inputs[3].value = target.dataset.x_max ?? String(graph_element.x_max);
  inputs[4].value = target.dataset.y_min ?? String(graph_element.y_min);
  inputs[5].value = target.dataset.y_max ?? String(graph_element.y_max);

  e.preventDefault();
}

export function openMultiplierPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, multiplierPopup);

  const target = e.currentTarget as DraggableComponentElement;
  updateTextAreaLines(functionTablePopup.querySelector("textarea")!);
  multiplierPopup.getElementsByTagName("textarea")[0].value = String(target.dataset.factor ?? "1");

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

export function openLabelPopup(e: MouseEvent): void {
  if (e.button != 2) return;
  if (currentlyDragging()) return;

  openPopup(e, labelPopup);

  const target = (e.currentTarget as DraggableComponentElement);
  const paragraph = target.querySelector("p")!;
  (labelPopup.querySelector("#label-popup-text") as HTMLInputElement)!.value = paragraph.textContent!;

  (labelPopup.querySelector("#label-popup-width") as HTMLInputElement)!.value = String(target.width);
  (labelPopup.querySelector("#label-popup-height") as HTMLInputElement)!.value = String(target.height);

  if (paragraph.style.textAlign == "left" || paragraph.style.textAlign == "") {
    (labelPopup.querySelector("#label-popup-align-left") as HTMLInputElement)!.checked = true;
  } else if (paragraph.style.textAlign == "center") {
    (labelPopup.querySelector("#label-popup-align-center") as HTMLInputElement)!.checked = true;
  } else if (paragraph.style.textAlign == "right") {
    (labelPopup.querySelector("#label-popup-align-right") as HTMLInputElement)!.checked = true;
  }


  e.preventDefault();
}


function closePopup(e: MouseEvent) {
  (e.currentTarget as HTMLDivElement).style.visibility = "hidden";
}

// Check whether the mouse event occurs within a popup
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

function closeAllPopups(): void {
  (document.querySelectorAll(".popup")! as NodeListOf<HTMLDivElement>).forEach((x: HTMLDivElement) => x.style.visibility = "hidden");
}

// Close all popups when a mouse click occurs and it is not contained within a popup
function documentClick(e: MouseEvent) {
  (document.querySelectorAll(".popup")! as NodeListOf<HTMLDivElement>).forEach((x: HTMLDivElement) => {
    if (!mouseWithin(x, e)) { x.style.visibility = "hidden"; }
  });
}

function setupCrossConnectPopup(): void {
  crossConnectPopup = document.getElementById("cross-connect-popup") as HTMLDivElement;
  // crossConnectPopup.addEventListener("mouseleave", closePopup);

  const inputs = crossConnectPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;
      component.querySelector("cross-connect-component")!.inverted = input.checked;
    });
  }
}

function setupIntegratorPopup(): void {
  integratorPopup = document.getElementById("integrator-popup") as HTMLDivElement;
  // integratorPopup.addEventListener("mouseleave", closePopup);

  setupTextAreaCallback(integratorPopup.querySelector("textarea")!);

  const inputs = integratorPopup.getElementsByTagName("textarea");
  inputs[0].addEventListener("change", (e) => {
    const input: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
    const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

    updateTextAreaLines(input);

    component.dataset.initialValue = input.value;
  })
}

function setupMultiplierPopup(): void {
  multiplierPopup = document.getElementById("multiplier-popup") as HTMLDivElement;
  // multiplierPopup.addEventListener("mouseleave", closePopup);

  setupTextAreaCallback(multiplierPopup.querySelector("textarea")!);

  const inputs = multiplierPopup.getElementsByTagName("textarea");
  inputs[0].addEventListener("change", (e) => {
    const input: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
    const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;

    updateTextAreaLines(input);

    component.dataset.factor = input.value;
  });
}

function setupGearPairPopup(): void {
  gearPairPopup = document.getElementById("gear-pair-popup") as HTMLDivElement;
  // gearPairPopup.addEventListener("mouseleave", closePopup);

  const inputs = gearPairPopup.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.querySelector(`#${input.parentElement!.dataset.id!} > gear-pair-component`) as GearPairComponentElement;

      const value = input.valueAsNumber;
      if (input.id == "gear-pair-top-ratio") {
        if (value == 0) { input.value = String(component.ratio_top); return; }

        component.ratio_top = ((value < 0) ? -1 : 1) * Math.min(Math.max(Math.abs(value), 1), 9);
        input.value = String(component.ratio_top);
      } else if (input.id == "gear-pair-bottom-ratio") {
        if (value == 0) { input.value = String(component.ratio_bottom); return; }

        component.ratio_bottom = ((value < 0) ? -1 : 1) * Math.min(Math.max(Math.abs(value), 1), 9);
        input.value = String(component.ratio_bottom);
      }
    })
  }
}

function setupFunctionTablePopup(): void {
  functionTablePopup = document.getElementById("function-table-popup") as HTMLDivElement;
  // functionTablePopup.addEventListener("mouseleave", closePopup);

  setupTextAreaCallback(functionTablePopup.querySelector("textarea")!);

  functionTablePopup.querySelector("textarea")!.addEventListener("change", e => {
    const input: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
    const component_graph = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > graph-table`) as GraphElement;
    component_graph.data_sets["d1"].fn = String(input.value);

    updateTextAreaLines(input);

    let compiled_expr = Expression.compile(component_graph.data_sets["d1"].fn ?? "0", get_global_ctx());
    let generator_exp = generator(500, component_graph.x_min, component_graph.x_max, x => compiled_expr({ x }));
    component_graph.mutate_data_set("d1", points => {
      points.splice(0, points.length, ...Array.from(generator_exp));
    }, true);
  });

  const inputs = functionTablePopup.querySelectorAll("* > input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!}`) as DraggableComponentElement;
      const component_graph = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > graph-table`) as GraphElement;

      switch (input.id) {
        case "function-table-x-min":
          component_graph.x_min = Expression.eval(input.value, get_global_ctx());
          component.dataset.x_min = input.value;
          break;
        case "function-table-x-max":
          component_graph.x_max = Expression.eval(input.value, get_global_ctx());
          component.dataset.x_max = input.value;
          break;
        case "function-table-y-min":
          component_graph.y_min = Expression.eval(input.value, get_global_ctx());
          component.dataset.y_min = input.value;
          break;
        case "function-table-y-max":
          component_graph.y_max = Expression.eval(input.value, get_global_ctx());
          component.dataset.y_max = input.value;
          break;
        case "function-table-lookup":
          component.dataset.lookup = input.checked ? "1" : "0";
          break;
      }

      let compiled_expr = Expression.compile(component_graph.data_sets["d1"].fn ?? "0", get_global_ctx());
      let generator_exp = generator(500, component_graph.x_min, component_graph.x_max, x => compiled_expr({ x }));
      component_graph.mutate_data_set("d1", points => {
        points.splice(0, points.length, ...Array.from(generator_exp));
      }, true);
    })
  }
}

function setupOutputTablePopup(): void {
  outputTablePopup = document.getElementById("output-table-popup") as HTMLDivElement;
  // outputTablePopup.addEventListener("mouseleave", closePopup);

  const button = outputTablePopup.querySelector("* > button") as HTMLButtonElement;
  button.addEventListener("click", e => {
    const input = e.currentTarget as HTMLButtonElement;
    const component_graph = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > graph-table`) as GraphElement;

    const keys = [...Object.keys(component_graph.data_sets)];
    let result = keys.map(k => `${k}_x,${k}_y,`).reduce((a, b) => a + b);
    const max_length = Object.values(component_graph.data_sets).map(v => v.points.length).reduce((a, b) => Math.max(a, b));
    for (let i = 0; i < max_length; i++) {
      result += "\n";
      for (let k of keys) {
        const v = component_graph.data_sets[k];
        if (v.points.length <= i) {
          continue;
        }

        result += `${v.points[i].x},${v.points[i].y},`
      }
    }

    const link = document.createElement("a");
    const file = new Blob([result], { type: "application/json" });

    link.href = URL.createObjectURL(file);
    link.download = `data-${input.parentElement!.parentElement!.dataset.id!}.csv`;
    link.click();

    URL.revokeObjectURL(link.href);
  });

  const inputs = outputTablePopup.querySelectorAll("* > input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!}`) as DraggableComponentElement;
      const component_graph = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > graph-table`) as GraphElement;

      switch (input.id) {
        case "output-table-initial-1":
          component.inputRatio = Expression.eval(input.value, get_global_ctx());
          component.dataset.initial_1 = input.value;
          break;
        case "output-table-initial-2":
          component.outputRatio = Expression.eval(input.value, get_global_ctx());
          component.dataset.initial_2 = input.value;
          break;
        case "output-table-x-min":
          component_graph.x_min = Expression.eval(input.value, get_global_ctx());
          component.dataset.x_min = input.value;
          break;
        case "output-table-x-max":
          component_graph.x_max = Expression.eval(input.value, get_global_ctx());
          component.dataset.x_max = input.value;
          break;
        case "output-table-y-min":
          component_graph.y_min = Expression.eval(input.value, get_global_ctx());
          component.dataset.y_min = input.value;
          break;
        case "output-table-y-max":
          component_graph.y_max = Expression.eval(input.value, get_global_ctx());
          component.dataset.y_max = input.value;
          break;
      }
    })
  }
}

function setupLabelPopup(): void {
  labelPopup = document.getElementById("label-popup") as HTMLDivElement;
  // labelPopup.addEventListener("mouseleave", closePopup);

  labelPopup.querySelector("#label-popup-text")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!} > p`) as HTMLParagraphElement;
    component.textContent = input.value;
  });

  labelPopup.querySelector("#label-popup-width")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!}`) as DraggableComponentElement;
    component.width = input.valueAsNumber;
  });

  labelPopup.querySelector("#label-popup-height")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    const component = document.querySelector(`#${input.parentElement!.parentElement!.dataset.id!}`) as DraggableComponentElement;
    component.height = input.valueAsNumber;
  });

  const setAlignment = (input: HTMLInputElement, align: string) => {
    const component = document.querySelector(`#${input.parentElement!.parentElement!.parentElement!.parentElement!.dataset.id!} > p`) as HTMLParagraphElement;
    if (input.checked) {
      component.style.textAlign = align;
    }
  }

  labelPopup.querySelector("#label-popup-align-left")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    setAlignment(input, "left");
  });

  labelPopup.querySelector("#label-popup-align-right")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    setAlignment(input, "right");
  });

  labelPopup.querySelector("#label-popup-align-center")!.addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    setAlignment(input, "center");
  });
}

// Update the length of a shaft depending on the values of negativeLength and positiveLength.
// Negative length denotes the left/top amount to change, while positive length denotes the right/bottom
// amount
export function updateShaftLength(comp: DraggableComponentElement, negativeLength: number, positiveLength: number) {
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

  let e = new CustomEvent("placecomponent");
  document.dispatchEvent(e);
}

function setupTextAreaCallback(area: HTMLTextAreaElement): void {
  area.addEventListener("keyup", e => {
    const input: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
    updateTextAreaLines(input);
  });
}

function updateTextAreaLines(area: HTMLTextAreaElement): void {
  const lines = area.value.split(/\r\n|\r|\n/).length;
  area.rows = Math.max(MIN_TEXT_AREA_LINES, Math.min(lines + 1, MAX_TEXT_AREA_LINES));
}
