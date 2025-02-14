import { ComponentType, createComponent, stringToComponent } from "./UI/Components";
import { DraggableComponentElement } from "./UI/DraggableElement.ts";
import { setCells, GRID_SIZE } from "./UI/Grid";
import Vector2 from "./UI/Vector2.ts";

export type Config = {
  shafts: ShaftConfig[];
  components: ComponentConfig[];
};

export type ShaftID = number;

export type ShaftConfig = {
  id: ShaftID;
  start: [number, number];
  end: [number, number];
};

export type ComponentConfig = IntegratorConfig | DifferentialConfig | MultiplierConfig | FunctionTableConfig | MotorConfig | OutputTableConfig | GearConfig | LabelConfig | GearPairConfig | DialConfig;

export type IntegratorConfig = {
  type: "integrator";
  compID: number;
  variableOfIntegrationShaft: ShaftID;
  integrandShaft: ShaftID;
  outputShaft: ShaftID;
  position: [number, number];
  reverse: boolean;
  initialPosition: number;
};

export type DifferentialConfig = {
  type: "differential";
  compID: number;
  diffShaft1: ShaftID;
  diffShaft2: ShaftID;
  sumShaft: ShaftID;
  position: [number, number];
};

export type MultiplierConfig = {
  type: "multiplier";
  compID: number;
  inputShaft: ShaftID;
  outputShaft: ShaftID;
  factor: number;
  position: [number, number];
};

export type FunctionTableConfig = {
  type: "functionTable";
  compID: number;
  inputShaft: ShaftID;
  outputShaft: ShaftID;
  position: [number, number];
};

export type MotorConfig = {
  type: "motor";
  compID: number;
  outputShaft: ShaftID;
  position: [number, number];
};

export type OutputTableConfig = {
  type: "outputTable";
  compID: number;
  inputShaft: ShaftID;
  outputShaft1: ShaftID;
  outputShaft2: ShaftID;
  position: [number, number];
};

export type GearConfig = {
  type: "gear";
  compID: number;
  horizontal: ShaftID;
  vertical: ShaftID;
  reversed: boolean;
  position: [number, number];
};

export type LabelConfig = {
  type: "label";
  compID: number;
  position: [number, number];
  size: [number, number];
  align: "left" | "right" | "center";
  _comment: string,
};

export type GearPairConfig = {
  type: "gearPair";
  compID: number;
  position: [number, number];
  inputRatio: number;
  outputRatio: number;
  shaft1: number;
  shaft2: number;
};

export type DialConfig = {
  type: "dial";
  compID: number;
  position: [number, number];
};

const type_name_dict = {
  "gear": "Gear",
  "integrator": "Integrator",
  "functionTable": "FunctionTable",
  "differential": "Differential",
  "outputTable": "OutputTable",
  "motor": "Motor",
  "multiplier": "Multiplier",
  "label": "Label",
  "gearPair": "GearPair",
  "dial": "Dial",
};

export function loadConfig(config: Config): void {
  // console.log(config.components);
  for (let components of config.components) {
    // console.log(components);
    // console.log(components.position);
    let [left, top] = components.position;
    let componentType = type_name_dict[components.type];
    if (componentType === null || componentType === undefined) {
      return;
    }

    let item = createComponent(stringToComponent(componentType) as ComponentType) as DraggableComponentElement;

    switch (components.type) {
      case "gear":
      case "integrator":
      case "differential":
      case "motor":
      case "multiplier":
      case "gearPair":
      case "dial":
        {
          item.import_fn(item, components);
          break;
        }

      case "label": {
        let [width, height] = components.size;
        item.width = width;
        item.height = height;
        let p = item.querySelector("p")!;
        p.style.textAlign = components.align;
        p.textContent = components._comment;
        break;
      }

      case "functionTable":
        {
          item.import_fn(item, components);
        }
        break;
      case "outputTable":
        // Not sure if data should be parsed through
        break;
    }
    item.top = top;
    item.left = left;
    item.renderTop = top * GRID_SIZE;
    item.renderLeft = left * GRID_SIZE;
    item.id = `component-${components.compID}`;

    setCells(new Vector2(left, top), item.getSize(), true);

    item.hasBeenPlaced = true;
    item.requestUpdate();

    document.getElementById("content")!.appendChild(item);
  }

  for (let shaft of config.shafts) {
    // console.log(config.shafts);
    // console.log(shaft);
    // console.log(shaft.start);
    // console.log(shaft.end);
    let [left, top] = shaft.start;
    let [right, bottom] = shaft.end;

    let width = right - left + 1;
    let height = bottom - top + 1;

    if (width > 1 && height > 1) {
      alert("Config file invalid");
      return;
    }

    let shaft_type = ComponentType.VShaft;
    if (width > 1) {
      shaft_type = ComponentType.HShaft;
    }

    let item = createComponent(shaft_type);
    item.top = top;
    item.left = left;
    item.renderTop = top * GRID_SIZE;
    item.renderLeft = left * GRID_SIZE;
    item.width = width;
    item.height = height;
    item.id = `shaft-component-${shaft.id}`;

    item.hasBeenPlaced = true;
    item.requestUpdate();

    document.getElementById("content")!.appendChild(item);
  }
}
