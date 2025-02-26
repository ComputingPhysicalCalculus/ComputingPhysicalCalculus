import { ComponentType, createComponent, stringToComponent, createUniqueID } from "./UI/Components";
import { machine } from "./UI/Constants.ts";
import { CustomVariablesElement } from "./UI/CustomVariablesElement.ts";
import { DraggableComponentElement } from "./UI/DraggableElement.ts";
import { setCells, GRID_SIZE } from "./UI/Grid";
import Vector2 from "./UI/Vector2.ts";

export type Config = {
  shafts: ShaftConfig[];
  components: ComponentConfig[];
  settings: {
    custom_variables: string;
  };
};

export type ShaftID = number;

export type ShaftConfig = {
  id: ShaftID;
  start: [number, number];
  end: [number, number];
};

export type ComponentConfig = IntegratorConfig | DifferentialConfig | MultiplierConfig | FunctionTableConfig | MotorConfig | OutputTableConfig | CrossConnectConfig | LabelConfig | GearPairConfig | DialConfig;

export type IntegratorConfig = {
  type: "integrator";
  compID: number;
  variableOfIntegrationShaft: ShaftID;
  integrandShaft: ShaftID;
  outputShaft: ShaftID;
  position: [number, number];
  reverse: boolean;
  initialPosition: string;
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
  multiplicandShaft: ShaftID;
  factor: string;
  position: [number, number];
};

export type FunctionTableConfig = {
  type: "functionTable";
  compID: number;
  inputShaft: ShaftID;
  outputShaft: ShaftID;
  position: [number, number];
  lookup: boolean;
  fn: string,
  x_min: string,
  x_max: string,
  y_min: string,
  y_max: string,
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
  initialY1: string,
  initialY2: string,
  x_min: string,
  x_max: string,
  y_min: string,
  y_max: string,
};

export type CrossConnectConfig = {
  type: "crossConnect";
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
  inputShaft: number;
};

const type_name_dict = {
  "crossConnect": "CrossConnect",
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
  let settings = config.settings;
  if (settings) {
    if (settings.custom_variables) {
      (document.querySelector("custom-variables")! as CustomVariablesElement).setText(config.settings.custom_variables);
    }
  }

  for (let components of config.components) {
    let [left, top] = components.position;
    let componentType = type_name_dict[components.type];
    if (componentType === null || componentType === undefined) {
      return;
    }

    let item = createComponent(stringToComponent(componentType) as ComponentType) as DraggableComponentElement;

    switch (components.type) {
      case "crossConnect":
      case "integrator":
      case "differential":
      case "motor":
      case "multiplier":
      case "gearPair":
      case "dial":
      case "functionTable":
      case "outputTable":
        item.import(components);
        break;

      case "label": {
        let [width, height] = components.size;
        item.import({
          ...components,
          width,
          height,
        })
      }
    }
    item.top = top;
    item.left = left;
    item.renderTop = top * GRID_SIZE;
    item.renderLeft = left * GRID_SIZE;
    item.componentID = createUniqueID();
    item.id = `component-${item.componentID}`;

    if (item.componentType != "label") {
      setCells(new Vector2(left, top), item.getSize(), true);
    }

    item.hasBeenPlaced = true;
    item.requestUpdate();

    machine.appendChild(item);
  }

  for (let shaft of config.shafts) {
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
    item.componentID = createUniqueID();
    item.id = `shaft-component-${item.componentID}`;

    item.hasBeenPlaced = true;
    item.requestUpdate();

    machine.appendChild(item);
  }
}
