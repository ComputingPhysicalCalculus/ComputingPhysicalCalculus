import { html, render } from "lit";
import { DraggableComponentElement } from "./DraggableElement.ts";
import { GraphElement } from "./GraphElement.ts";
import { generator } from "../index.ts";
import { openShaftPopup, openGearPopup, openMultiplierPopup, openMotorPopup, openIntegratorPopup } from "./Popups.ts"
import Vector2 from "./Vector2.ts";

export enum ComponentType {
  VShaft,
  HShaft,
  Gear,
  Integrator,
  FunctionTable,
  Differential,
  OutputTable,
  Motor,
  Multiplier,
  Label,
};

let CURRENT_ID: number = 0;


export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
  const comp = document.createElement("draggable-component") as DraggableComponentElement;

  comp.classList.add("placed-component")

  comp.style.position = "absolute";

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
    case ComponentType.Label:
      createLabel(comp);
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

  type ExportedData = {
    top: number,
    left: number,
    height: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.VShaft,
      data: {
        top: _this.top,
        left: _this.left,
        height: _this.height,
      }
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top,
      _this.left = data.left,
      _this.height = data.height;
  }
}

function createLabel(div: DraggableComponentElement): void {
  div.width = 3;
  div.height = 1;
  div.componentType = "label";
  div.shouldLockCells = false;

  div.classList.add("label");

  div.addEventListener("contextmenu", openShaftPopup);

  render(html`<p style="color:black;font-size:2rem;width:100%;padding:0.5rem">This is a label</p>`, div);

  type ExportedData = {
    top: number,
    left: number,
    width: number,
    height: number,
    align: string,
    _comment: string,
  };

  div.export_fn = (_this) => {
    let p = _this.querySelector("p")!;
    return {
      _type: ComponentType.Label,
      data: {
        top: _this.top,
        left: _this.left,
        height: _this.height,
        width: _this.width,
        align: p.style.textAlign,
        _comment: p.textContent,
      }
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
    _this.height = data.height;
    _this.width = data.width;

    let p = _this.querySelector("p")!;
    p.style.textAlign = data.align;
    p.textContent = data._comment;
  };
}

function createGear(div: DraggableComponentElement): void {
  div.width = 1;
  div.height = 1;
  div.componentType = "gear";
  div.shouldLockCells = true;
  div.classList.add("gear");

  div.addEventListener("contextmenu", openGearPopup);

  render(html`<gear-component teeth="6" style="width:100%;height:100%"></gear-component>`, div);

  type ExportedData = {
    top: number,
    left: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.Gear,
      data: {
        top: _this.top,
        left: _this.left,
      },
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
  };
}

function createHShaft(div: DraggableComponentElement): void {
  div.width = 2;
  div.height = 1;
  div.componentType = "hShaft";
  div.shouldLockCells = false;;
  div.classList.add("hShaft");

  div.addEventListener("contextmenu", openShaftPopup);

  render(html`<shaft-component style="width: 100%;height:100%" horizontal></shaft-component>`, div);

  type ExportedData = {
    top: number,
    left: number,
    width: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.HShaft,
      data: {
        top: _this.top,
        left: _this.left,
        width: _this.width,
      }
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top,
      _this.left = data.left,
      _this.width = data.width;
  }
}

function createIntegrator(div: DraggableComponentElement): void {
  div.width = 3;
  div.height = 2;
  div.componentType = "integrator";
  div.shouldLockCells = true;
  div.classList.add("integrator");

  render(html`<integrator-component></integrator-component>`, div);

  div.addEventListener("contextmenu", openIntegratorPopup);

  type ExportedData = {
    top: number,
    left: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.Integrator,
      data: {
        top: _this.top,
        left: _this.left,
      },
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
  };
}

function createFunctionTable(div: DraggableComponentElement): void {
  div.style.background = "white";
  div.style.border = "2px solid black";
  div.style.borderRadius = "5px";
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

  type ExportedData = {
    top: number,
    left: number,
    x_min: number,
    x_max: number,
    y_min: number,
    y_max: number,
    gantry_x?: number,
    data_sets: {
      [key: string]: {
        points: Vector2[],
        style: string,
        invert_head: boolean,
      },
    },
  };

  div.export_fn = (_this) => {
    let graph_element = _this.querySelector("graph-table") as GraphElement;

    return {
      _type: ComponentType.FunctionTable,
      data: {
        top: _this.top,
        left: _this.left,
        x_min: graph_element.x_min,
        x_max: graph_element.x_max,
        y_min: graph_element.y_min,
        y_max: graph_element.y_max,
        gantry_x: graph_element.gantry_x,
        data_sets: graph_element.data_sets,
      }
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    let graph_element = _this.querySelector("graph-table") as GraphElement;

    _this.top = data.top,
      _this.left = data.left,
      graph_element.x_min = data.x_min;
    graph_element.x_max = data.x_max;
    graph_element.y_min = data.y_min;
    graph_element.y_max = data.y_max;
    graph_element.gantry_x = data.gantry_x;
    graph_element.data_sets = data.data_sets;
  }
}


function createDifferential(div: DraggableComponentElement): void {
  div.width = 1;
  div.height = 3;
  div.componentType = "differential";
  div.shouldLockCells = true;
  div.classList.add("differential");

  render(html`<differential-component style="width:100%;height:100%"></differential-component>`, div);

  type ExportedData = {
    top: number,
    left: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.Differential,
      data: {
        top: _this.top,
        left: _this.left,
      },
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
  };
}

function createOutputTable(div: DraggableComponentElement): void {
  div.style.background = "white";
  div.style.border = "2px solid black";
  div.style.borderRadius = "5px";
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

  type ExportedData = {
    top: number,
    left: number,
    x_min: number,
    x_max: number,
    y_min: number,
    y_max: number,
    gantry_x?: number,
    data_sets: {
      [key: string]: {
        points: Vector2[],
        style: string,
        invert_head: boolean,
      },
    },
  };

  div.export_fn = (_this) => {
    let graph_element = _this.querySelector("graph-table") as GraphElement;

    return {
      _type: ComponentType.OutputTable,
      data: {
        top: _this.top,
        left: _this.left,
        x_min: graph_element.x_min,
        x_max: graph_element.x_max,
        y_min: graph_element.y_min,
        y_max: graph_element.y_max,
        gantry_x: graph_element.gantry_x,
        data_sets: graph_element.data_sets,
      }
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    let graph_element = _this.querySelector("graph-table") as GraphElement;

    _this.top = data.top,
      _this.left = data.left,
      graph_element.x_min = data.x_min;
    graph_element.x_max = data.x_max;
    graph_element.y_min = data.y_min;
    graph_element.y_max = data.y_max;
    graph_element.gantry_x = data.gantry_x;
    graph_element.data_sets = data.data_sets;
  }
}

function createMotor(div: DraggableComponentElement): void {
  div.width = 2;
  div.height = 1;
  div.componentType = "motor";
  div.shouldLockCells = true;
  div.classList.add("motor");

  div.outputRatio = 1;

  render(html`<motor-component style="width:100%;height:100%"></motor-component>`, div);

  div.addEventListener("contextmenu", openMotorPopup);

  type ExportedData = {
    top: number,
    left: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.Motor,
      data: {
        top: _this.top,
        left: _this.left,
      },
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
  };
}

function createMultiplier(div: DraggableComponentElement): void {
  div.width = 3;
  div.height = 2;
  div.componentType = "multiplier";
  div.shouldLockCells = true;
  div.classList.add("multiplier");

  div.addEventListener("contextmenu", openMultiplierPopup);

  render(html`<multiplier-component style="width:100%;height:100%"></multiplier-component>`, div);

  type ExportedData = {
    top: number,
    left: number,
  };

  div.export_fn = (_this) => {
    return {
      _type: ComponentType.Multiplier,
      data: {
        top: _this.top,
        left: _this.left,
      },
    };
  };

  div.import_fn = (_this, data: ExportedData) => {
    _this.top = data.top;
    _this.left = data.left;
  };
}
