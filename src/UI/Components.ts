import { html, render } from "lit";
import { GRID_SIZE } from "./Grid.ts"
import { DraggableComponentElement } from "./DraggableElement.ts";

export enum ComponentType {
  VShaft,
  HShaft,
  Multiplier
};

let shaftpopup: HTMLDivElement;

export function setupPopups(): void {
  {
    shaftpopup = document.createElement("div");
    shaftpopup.id = "shaft_popup";
    shaftpopup.style.visibility = "hidden";

    shaftpopup.addEventListener("mouseleave", () => {
      shaftpopup.style.visibility = "hidden";
    })

    document.getElementById("content")!.appendChild(shaftpopup);
  }
}

export function stringToComponent(componentName: string): ComponentType | null {
  return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
  const comp = document.createElement("draggable-component") as DraggableComponentElement;

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

  comp.style.width = Number(comp.width) * GRID_SIZE + "px";
  comp.style.height = Number(comp.height) * GRID_SIZE + "px";

  return comp;
}

function createVShaft(div: DraggableComponentElement): void {
  div.style.background = "Red";
  div.setAttribute("width", "1");
  div.setAttribute("height", "2");

  div.addEventListener("contextmenu", (e) => {
    shaftpopup.style.visibility = "visible";
    shaftpopup.style.left = e.clientX + "px";
    shaftpopup.style.top = e.clientY + "px";
    shaftpopup.style.zIndex = "10";
    console.log("popup");
    e.preventDefault();
  });
}

function createHShaft(div: DraggableComponentElement): void {
  div.style.background = "Green";
  div.setAttribute("width", "2");
  div.setAttribute("height", "1");
}

function createMultiplier(div: DraggableComponentElement): void {
  div.style.background = "Blue";
  div.setAttribute("width", "2");
  div.setAttribute("height", "2");

  render(html`<integrator-component></integrator-component>`, div);
}
