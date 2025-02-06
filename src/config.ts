import { ComponentType, createComponent, stringToComponent } from "./UI/Components";

export type Config = {
  shafts: ShaftConfig[];
  components: ComponentConfig[];
};

export type ShaftID = number;

export type ShaftConfig = {
  shaftID: ShaftID;
  start: [ number, number ];
  end: [ number, number ];
};

export type ComponentConfig = IntegratorConfig | DifferentialConfig | MultiplierConfig | FunctionTableConfig | MotorConfig | OutputTableConfig | GearConfig;

export type IntegratorConfig = {
  type: "integrator";
  compID: number;
  variableOfIntegrationShaft: ShaftID;
  intagrandShaft: ShaftID;
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

export function downloadConfig(config: Config): void {
  const link = document.createElement("a");
  const file = new Blob([JSON.stringify(config)], { type: "application/json" });

  link.href = URL.createObjectURL(file);
  link.download = "differential-analyzer.json";
  link.click();

  URL.revokeObjectURL(link.href);
}

export function clearEnvironment(): void {
  let components = document.querySelectorAll(".placed-component");
  for (let component of components) {
    console.log(component);
    component.remove();
  }
}

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
  clearEnvironment();

  console.log(config);

  for (let components of config.components) {
    let [top, left] = components.position;
    let componentType = type_name_dict[components.type];
    if (componentType === null || componentType === undefined) {
      return;
    }

    let item = createComponent(stringToComponent(componentType) as ComponentType);
    item.top = top;
    item.left = left;

    item.dataset.hasBeenPlaced = "0";

    document.getElementById("content")!.appendChild(item);
  }

  for (let shaft of config.shafts) {
    console.log(shaft);
    let [top, left] = shaft.start;
    let [bottom, right] = shaft.end;

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

    item.dataset.hasBeenPlaced = "0";

    document.getElementById("content")!.appendChild(item);
  }
}
