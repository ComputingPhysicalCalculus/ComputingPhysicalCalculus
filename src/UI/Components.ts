import { html, render } from "lit";
import { DraggableComponentElement } from "./DraggableElement.ts";
import { GraphElement } from "./GraphElement.ts";
import { generator } from "../index.ts";
import { openShaftPopup, openGearPopup, openMultiplierPopup } from "./Popups.ts"

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

let CURRENT_ID: number = 0;


export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
  const comp = document.createElement("draggable-component") as DraggableComponentElement;

  comp.classList.add("placed-component")

  comp.style.position = "absolute";
  // comp.style.background = "Blue";

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
  div.width = 1;
  div.height = 2;
  div.componentType = "vShaft";
  div.shouldLockCells = false;;

  div.classList.add("vShaft");

  div.addEventListener("contextmenu", openShaftPopup);

  render(html`<shaft-component style="width:100%;height:100%"></shaft-component>`, div);
}

function createGear(div: DraggableComponentElement): void {
  div.width = 1;
  div.height = 1;
  div.componentType = "gear";
  div.shouldLockCells = true;
  div.classList.add("gear");

  div.addEventListener("contextmenu", openGearPopup);

  render(html`<gear-component teeth="6" style="width:100%;height:100%"></gear-component>`, div)
}

function createHShaft(div: DraggableComponentElement): void {
  div.width = 2;
  div.height = 1;
  div.componentType = "hShaft";
  div.shouldLockCells = false;;
  div.classList.add("hShaft");

  div.addEventListener("contextmenu", openShaftPopup);

  render(html`<shaft-component style="width: 100%;height:100%" horizontal></shaft-component>`, div);
}

function createIntegrator(div: DraggableComponentElement): void {
  div.width = 3;
  div.height = 2;
  div.componentType = "integrator";
  div.shouldLockCells = true;
  div.classList.add("integrator");

  render(html`<integrator-component></integrator-component>`, div);
}

function createFunctionTable(div: DraggableComponentElement): void {
  div.style.background = "white";
  div.style.border = "2px solid black";
  div.style["border-radius"] = "5px";
  div.width = 4;
  div.height = 4;
  div.componentType = "functionTable";
  div.shouldLockCells = true;
  div.classList.add("functionTable");

  let function_table = document.createElement("graph-table") as GraphElement;
  function_table.setAttribute("style", "width:100%;height:100%");
  function_table.setAttribute("x-min", "0.0");
  function_table.setAttribute("x-max", "10.0");
  function_table.setAttribute("y-min", "-1.5");
  function_table.setAttribute("y-max", "1.5");
  function_table.setAttribute("gantry-x", "0.0");
  function_table.setAttribute("padding", "5");

  let generator_exp = generator(100, function_table.x_min, function_table.x_max, Math.sin);

  function_table.set_data_set("a", Array.from([...generator_exp]));
  div.appendChild(function_table);
}


function createDifferential(div: DraggableComponentElement): void {
  div.width = 1;
  div.height = 3;
  div.componentType = "differential";
  div.shouldLockCells = true;
  div.classList.add("differential");

  render(html`<differential-component></differential-component>`, div);
}

function createOutputTable(div: DraggableComponentElement): void {
  div.style.background = "white";
  div.style.border = "2px solid black";
  div.style["border-radius"] = "5px";
  div.width = 4;
  div.height = 4;
  div.componentType = "outputTable";
  div.shouldLockCells = true;
  div.classList.add("outputTable");

  render(html`
    <graph-table
      style="width:100%;height:100%"
      x-min="0.0"
      x-max="10.0"
      y-min="-1.5"
      y-max="1.5"
      gantry-x="0.0"
      padding="5"
    >
    </graph-table>
  `, div)

  let graph = div.querySelector("graph-table") as GraphElement;

  graph.set_data_set("1", [{ x: 0, y: 0 }], "blue");
  graph.set_data_set("2", [{ x: 0, y: 0 }], "red", true);
}

function createMotor(div: DraggableComponentElement): void {
  div.width = 2;
  div.height = 1;
  div.componentType = "motor";
  div.shouldLockCells = true;
  div.classList.add("motor");

  render(html`<motor-component style="width:100%;height:100%"></motor-component>`, div);
}

function createMultiplier(div: DraggableComponentElement): void {
  div.width = 3;
  div.height = 2;
  div.componentType = "multiplier";
  div.shouldLockCells = true;
  div.classList.add("multiplier");

  div.addEventListener("contextmenu", openMultiplierPopup);
}


