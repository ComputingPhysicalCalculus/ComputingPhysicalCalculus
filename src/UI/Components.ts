import { html, render } from "lit";
import { GRID_SIZE } from "./Grid.ts"
import { DraggableComponentElement } from "./DraggableElement.ts";
import { GraphElement } from "./GraphElement.ts";
import { generator } from "../index.ts";

export enum ComponentType {
  VShaft,
  HShaft,
  Gear,
  Integrator,
  FunctionTable,
  Differential,
  OutputTable,
  Motor,
  Multiplier
};

let shaftpopup: HTMLDivElement;
let CURRENT_ID: number = 0;

export function setupPopups(): void {
  shaftpopup = document.getElementById("shaft-popup") as HTMLDivElement;
  shaftpopup.addEventListener("mouseleave", (e) => {
    (e.currentTarget as HTMLDivElement).style.visibility = "hidden";
  });

  const buttons = shaftpopup.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {
      const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
      const component = document.getElementById(input.parentElement!.parentElement!.dataset.id!) as DraggableComponentElement;

      let negativeLength = 0;
      if (input.id == "shaft-popup-negative-increase") negativeLength = 1;
      if (input.id == "shaft-popup-negative-decrease") negativeLength = -1;

      let positiveLength = 0;
      if (input.id == "shaft-popup-positive-increase") positiveLength = 1;
      if (input.id == "shaft-popup-positiive-decrease") positiveLength = -1;

      updateShaftLength(component, negativeLength, positiveLength);
    })
  }
}

export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
  const comp = document.createElement("draggable-component") as DraggableComponentElement;

  comp.classList.add("placed-component")

  comp.style.position = "absolute";
  comp.style.background = "Blue";

  setID(comp);

  switch (component) {
    case ComponentType.VShaft:
      createVShaft(comp);
      break;
    case ComponentType.Gear:
      createGear(comp);
      break;
    case ComponentType.HShaft:
      createHShaft(comp);
      break;
    case ComponentType.Integrator:
      createIntegrator(comp);
      break;
    case ComponentType.FunctionTable:
      createFunctionTable(comp);
      break;
    case ComponentType.Differential:
      createDifferential(comp);
      break;
    case ComponentType.OutputTable:
      createOutputTable(comp);
      break;
    case ComponentType.Motor:
      createMotor(comp);
      break;
    case ComponentType.Multiplier:
      createMultiplier(comp);
      break;
    default:
      console.error("No function defined for component: ", component);
  }

  return comp;
}

function createUniqueID(): number {
  const v = CURRENT_ID;
  CURRENT_ID += 1;
  return v;
}

function setID(div: DraggableComponentElement): void {
  const v = createUniqueID();
  div.setAttribute("componentID", v + "");
  div.id = "component-" + v;
}

function createVShaft(div: DraggableComponentElement): void {
  div.style.background = "Red";
  div.width = 1;
  div.height = 2;
  div.componentType = "vShaft";
  div.shouldLockCells = false;;

  div.classList.add("vShaft");

  div.addEventListener("contextmenu", (e) => {
    shaftpopup.style.visibility = "visible";
    shaftpopup.style.left = e.clientX + "px";
    shaftpopup.style.top = e.clientY + "px";
    shaftpopup.style.zIndex = "10";

    const target: DraggableComponentElement = e.currentTarget as DraggableComponentElement;
    const inputs = shaftpopup.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "0";
    }

    shaftpopup.dataset.id = target.id;

    e.preventDefault();
  });

  render(html`<shaft-component style="width:100%;height:100%"></shaft-component>`, div);
}

function createGear(div: DraggableComponentElement): void {
  div.style.background = "Cyan";
  div.width = 1;
  div.height = 1;
  div.componentType = "gear";
  div.shouldLockCells = true;
  div.classList.add("gear");
}

function createHShaft(div: DraggableComponentElement): void {
  div.style.background = "Green";
  div.width = 2;
  div.height = 1;
  div.componentType = "hShaft";
  div.shouldLockCells = false;;

  div.classList.add("hShaft");

  div.addEventListener("contextmenu", (e) => {
    shaftpopup.style.visibility = "visible";
    shaftpopup.style.left = e.clientX + "px";
    shaftpopup.style.top = e.clientY + "px";
    shaftpopup.style.zIndex = "10";

    const target: DraggableComponentElement = e.currentTarget as DraggableComponentElement;
    const inputs = shaftpopup.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "0";
    }
    shaftpopup.dataset.id = target.id;

    e.preventDefault();
  });

  render(html`<shaft-component style="width: 100%;height:100%" horizontal></shaft-component>`, div);
}

function createIntegrator(div: DraggableComponentElement): void {
  div.style.background = "DarkMagenta";
  div.width = 3;
  div.height = 2;
  div.componentType = "integrator";
  div.shouldLockCells = true;
  div.classList.add("integrator");
}

function createFunctionTable(div: DraggableComponentElement): void {
  div.style.background = "lightgray";
  div.width = 4;
  div.height = 4;
  div.componentType = "functionTable";
  div.shouldLockCells = true;
  div.classList.add("functionTable");

  let function_table = document.createElement("graph-table") as GraphElement;
  function_table.setAttribute("style", "width:100%;height:100%");
  function_table.setAttribute("x-min", "0.0");
  function_table.setAttribute("x-max", "2.0");
  function_table.setAttribute("y-min", "0.0");
  function_table.setAttribute("y-max", "5.0");
  function_table.setAttribute("gantry-x", "1.0");
  function_table.setAttribute("padding", "1");

  let generator_exp = generator(100, function_table.x_min, function_table.x_max, x => Math.exp(x));

  function_table.set_data_set("a", Array.from([...generator_exp]));
  div.appendChild(function_table);
}


function createDifferential(div: DraggableComponentElement): void {
  div.style.background = "LawnGreen";
  div.width = 1;
  div.height = 3;
  div.componentType = "differential";
  div.shouldLockCells = true;
  div.classList.add("differential");
}

function createOutputTable(div: DraggableComponentElement): void {
  div.style.background = "Brown";
  div.width = 4;
  div.height = 4;
  div.componentType = "outputTable";
  div.shouldLockCells = true;
  div.classList.add("outputTable");
}

function createMotor(div: DraggableComponentElement): void {
  div.style.background = "Aquamarine";
  div.width = 2;
  div.height = 1;
  div.componentType = "motor";
  div.shouldLockCells = true;
  div.classList.add("motor");
}

function createMultiplier(div: DraggableComponentElement): void {
  div.style.background = "Blue";
  div.width = 3;
  div.height = 2;
  div.componentType = "multiplier";
  div.shouldLockCells = true;
  div.classList.add("multiplier");

  render(html`<integrator-component></integrator-component>`, div);
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
