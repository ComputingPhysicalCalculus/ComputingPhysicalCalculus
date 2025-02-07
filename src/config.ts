import { ComponentType, createComponent, stringToComponent } from "./UI/Components";

export type Config = {
  shafts: ShaftConfig[];
  components: ComponentConfig[];
};

export type ShaftID = number;

export type ShaftConfig = {
  id: ShaftID;
  start: [ number, number ];
  end: [ number, number ];
};

export type ComponentConfig = IntegratorConfig | DifferentialConfig | MultiplierConfig | FunctionTableConfig | MotorConfig | OutputTableConfig | GearConfig;

export type IntegratorConfig = {
  type: "integrator";
  compID: number;
  variableOfIntegrationShaft: ShaftID;
  integrandShaft: ShaftID;
  outputShaft: ShaftID;
  position: [ number, number ];
};

export type DifferentialConfig = {
  type: "differential";
  compID: number;
  inputShaft1: ShaftID;
  inputShaft2: ShaftID;
  outputShaft: ShaftID;
  position: [ number, number ];
};

export type MultiplierConfig = {
  type: "multiplier";
  compID: number;
  inputShaft: ShaftID;
  outputShaft: ShaftID;
  factor: ShaftID;
  position: [ number, number ];
};

export type FunctionTableConfig = {
  type: "functionTable";
  compID: number;
  inputShaft: ShaftID;
  outputShaft: ShaftID;
  position: [ number, number ];
};

export type MotorConfig = {
  type: "motor";
  compID: number;
  outputShaft: ShaftID;
  position: [ number, number ];
};

export type OutputTableConfig = {
  type: "outputTable";
  compID: number;
  inputShaft: ShaftID;
  outputShaft1: ShaftID;
  outputShaft2: ShaftID;
  position: [ number, number ];
};

export type GearConfig = {
  type: "gear";
  compID: number;
  horizontal: ShaftID;
  vertical: ShaftID;
  ratio: number;
  position: [ number, number ];
};

const type_name_dict = {
  "gear": "Gear",
  "integrator": "Integrator",
  "functionTable": "FunctionTable",
  "differential": "Differential",
  "outputTable": "OutputTable",
  "motor": "Motor",
  "multiplier": "Multiplier",
};

export function loadConfig(config: Config): void {
  for (let components of config.components) {
    let [left, top] = components.position;
    let componentType = type_name_dict[components.type];
    if (componentType === null || componentType === undefined) {
      return;
    }

    let item = createComponent(stringToComponent(componentType) as ComponentType);
    item.top = top;
    item.left = left;
    item.id = `component-${components.compID}`;

    item.dataset.hasBeenPlaced = "0";

    document.getElementById("content")!.appendChild(item);
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
    item.width = width;
    item.height = height;
    item.id = `shaft-component-${shaft.id}`;

    item.dataset.hasBeenPlaced = "0";

    document.getElementById("content")!.appendChild(item);
  }
}
