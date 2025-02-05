import { html, render } from "lit";
import { GRID_SIZE } from "./Grid.ts"
import { DraggableComponentElement } from "./DraggableElement.ts";

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

  shaftpopup.getElementsByTagName("input")[0].addEventListener("change", (e) => {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    const component = document.getElementById(input.parentElement!.dataset.id!) as DraggableComponentElement;
    updateShaftLength(component, Number(input.value));
  });
}

export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
  const comp = document.createElement("draggable-component") as DraggableComponentElement;

  comp.classList.add("placed-component")

  comp.style.position = "absolute";
  comp.style.background = "Blue";
  comp.style.width = GRID_SIZE + "px";
  comp.style.height = GRID_SIZE + "px";

  setID(comp);

  switch (component) {
    case ComponentType.VShaft:
      createVShaft(comp);
      break;
    case ComponentType.HShaft:
      createHShaft(comp);
      break;
    case ComponentType.Gear:
    case ComponentType.Integrator:
    case ComponentType.FunctionTable:
    case ComponentType.Differential:
    case ComponentType.OutputTable:
    case ComponentType.Motor:
      temp(comp);
      break;
    case ComponentType.Multiplier:
      createMultiplier(comp);
      break;
    default:
      console.error("No function defined for component: ", component);
  }

  comp.style.width = Number(comp.width) * GRID_SIZE + "px";
  comp.style.height = Number(comp.height) * GRID_SIZE + "px";

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
    shaftpopup.getElementsByTagName("input")[0].value = target.getAttribute("height") as string;
    shaftpopup.dataset.id = target.id;

    e.preventDefault();
  });
}

function temp(div: DraggableComponentElement): void {
  div.style.background = "Cyan";
  div.setAttribute("width", "4");
  div.setAttribute("height", "4");
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
    shaftpopup.getElementsByTagName("input")[0].value = target.getAttribute("width") as string;
    shaftpopup.dataset.id = target.id;

    e.preventDefault();
  });
}

function createMultiplier(div: DraggableComponentElement): void {
  div.style.background = "Blue";
  div.setAttribute("width", "3");
  div.setAttribute("height", "2");

  render(html`<integrator-component></integrator-component>`, div);
}

function updateShaftLength(comp: DraggableComponentElement, newLength: number) {
  const isVertical = comp.componentType == "vShaft";

  if (isVertical) {
    comp.setAttribute("height", newLength + "");
    comp.style.height = Number(comp.height) * GRID_SIZE + "px";
  } else {
    comp.setAttribute("width", newLength + "");
    comp.style.width = Number(comp.width) * GRID_SIZE + "px";
  }
}
