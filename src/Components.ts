import { GRID_SIZE } from "./Grid.ts"

export enum ComponentType {
  VShaft,
  HShaft
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
    default:
      console.error("No function defined for component: ", component);
  }

  return comp;
}

function createVShaft(div: HTMLDivElement): void {
  div.style.width = GRID_SIZE + "px";
  div.style.height = 2 * GRID_SIZE + "px";
  div.style.background = "Red";
}

function createHShaft(div: HTMLDivElement): void {
  div.style.width = 2 * GRID_SIZE + "px";
  div.style.height = GRID_SIZE + "px";
  div.style.background = "Green";
}
