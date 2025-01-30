import { GRID_SIZE } from "./Grid.ts"

export enum ComponentType {
  VShaft,
  HShaft,
  Multiplier
};

export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): HTMLDivElement {
  const comp = document.createElement("div");

  comp.id = "component";

  comp.style.position = "absolute";
  comp.style.background = "Blue";
  comp.style.width = GRID_SIZE + "px";
  comp.style.height = GRID_SIZE + "px";

  switch (component) {
    case ComponentType.VShaft:
      createVShaft(comp);
      break;
    case ComponentType.HShaft:
      createHShaft(comp);
      break;
    case ComponentType.Multiplier:
      createMultiplier(comp);
      break;
    default:
      console.error("No function defined for component: ", component);
  }

  comp.style.width = Number(comp.dataset.width) * GRID_SIZE + "px";
  comp.style.height = Number(comp.dataset.height) * GRID_SIZE + "px";

  return comp;
}

function createVShaft(div: HTMLDivElement): void {
  div.dataset.width = "1";
  div.dataset.height = "2";
  div.style.background = "Red";
}

function createHShaft(div: HTMLDivElement): void {
  div.dataset.width = "2";
  div.dataset.height = "1";
  div.style.background = "Green";
}

function createMultiplier(div: HTMLDivElement): void {
  div.dataset.width = "3";
  div.dataset.height = "1";
  div.style.background = "Blue";
}
