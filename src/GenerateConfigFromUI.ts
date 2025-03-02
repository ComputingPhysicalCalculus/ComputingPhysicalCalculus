import { CustomVariablesElement } from "./UI/CustomVariablesElement.ts";
import { DraggableComponentElement } from "./UI/DraggableElement.ts";
import { Config } from "./config";
// used to configure parameters and initial setings
// go from UI to config which can be saved and loaded 

// asumming valid config is checked as we build

function getShaft(className: string, predicate: (x: number, y: number, w: number, h: number) => boolean): number | null {
  const shafts = document.querySelectorAll(`.${className}`) as NodeListOf<DraggableComponentElement>;
  for (let i = 0; i < shafts.length; i++) {
    const vShaft = shafts[i] as DraggableComponentElement;

    if (predicate(vShaft.left, vShaft.top, vShaft.width, vShaft.height)) {
      return vShaft.componentID;
    }
  }

  return null;
}

export function getVShaftID(x: number, y: number): number | null {
  return getShaft("vShaft", (sX, sY, _, sH) => {
    return (sX == x) && (sY <= y && sY + sH - 1 >= y);
  });
}

export function getHShaftID(x: number, y: number): number | null {
  return getShaft("hShaft", (sX, sY, sW) => {
    return (sY == y) && (sX <= x && sX + sW - 1 >= x);
  });
}

// take a component, get it's name, location/position, 
export function toConfig(): [Config, number[]] {
  //  iterate through
  const elements = document.querySelectorAll(".placed-component") as NodeListOf<DraggableComponentElement>;
  const shaftElements = Array.from(elements).filter(element => element.componentType.endsWith("Shaft"));
  const config1 = Array.from(shaftElements).map((thisComponent) => {
    // for shafts
    if ((thisComponent.componentType === "vShaft") || (thisComponent.componentType === "hShaft")) {
      // id
      const id = thisComponent.componentID;
      // position
      const start = [Number(thisComponent.left), Number(thisComponent.top)];

      const shaft: any = { id, start };

      // if vertical
      if (thisComponent.componentType === "vShaft") {
        // height
        // shaft.height = thisComponent.height;
        shaft.end = [Number(thisComponent.left), Number(thisComponent.top) + thisComponent.height - 1];
      }
      // if horizontal
      else if (thisComponent.componentType === "hShaft") {
        // width
        // shaft.width = thisComponent.width;
        shaft.end = [Number(thisComponent.left) + thisComponent.width - 1, Number(thisComponent.top)];
      }
      // remove this shaft from the list of components
      // elements.remove(thisComponent); 
      return shaft;
    }
  });

  const componentElements = Array.from(elements).filter(element => !element.componentType.endsWith("Shaft"));
  // for all components
  const config2 = Array.from(componentElements).map((thisComponent) => {

    const type = thisComponent.componentType;
    // id
    const compID = thisComponent.componentID;
    // position
    const position = [Number(thisComponent.left), Number(thisComponent.top)];

    let result = null;

    switch (thisComponent.componentType) {
      case 'crossConnect':
        {
          const { reversed } = thisComponent.export_fn(thisComponent).data;

          const vertical = getVShaftID(position[0], position[1]);
          const horizontal = getHShaftID(position[0], position[1]);

          if (vertical === null || horizontal == null) {
            break;;
          }

          result = { type, compID, position, reversed, vertical, horizontal }
          break;
        }
      case 'integrator':
        {
          const { initialPosition } = thisComponent.export_fn(thisComponent).data;

          const outputShaft = getVShaftID(position[0] + 1, position[1] - 1);
          const variableOfIntegrationShaft = getVShaftID(position[0] + 2, position[1] - 1);
          const integrandShaft = getVShaftID(position[0] + 3, position[1] - 1);

          if (outputShaft === null || variableOfIntegrationShaft === null || integrandShaft === null) {
            break;;
          }

          result = { type, compID, position, outputShaft, variableOfIntegrationShaft, integrandShaft, initialPosition };
          break;
        }
      case 'functionTable':
        {
          const { x_min, x_max, y_min, y_max, lookup, fn } = thisComponent.export_fn(thisComponent).data;

          const inputShaft = getVShaftID(position[0] + 2, position[1] + 4);
          const outputShaft = getVShaftID(position[0] + 3, position[1] + 4);

          if (inputShaft === null || outputShaft === null) {
            break;
          }

          result = { type, compID, position, x_min, x_max, y_min, y_max, inputShaft, outputShaft, lookup, fn }
          break;
        }
      case 'differential':
        {
          const diffShaft1 = getHShaftID(position[0], position[1]);
          const sumShaft = getHShaftID(position[0], position[1] + 1);
          const diffShaft2 = getHShaftID(position[0], position[1] + 2);

          if (diffShaft1 === null || sumShaft === null || diffShaft2 === null) {
            break;
          }

          result = { type, compID, position, diffShaft1, sumShaft, diffShaft2 }
          break;
        }
      case 'outputTable':
        {
          const { x_min, x_max, y_min, y_max, initialY1, initialY2 } = thisComponent.export_fn(thisComponent).data;

          const inputShaft = getVShaftID(position[0] + 1, position[1] + 4);
          const outputShaft1 = getVShaftID(position[0] + 2, position[1] + 4);
          const outputShaft2 = getVShaftID(position[0] + 3, position[1] + 4);

          if (inputShaft === null || (outputShaft1 === null && outputShaft2 === null)) {
            break;
          }

          result = { type, compID, position, x_min, x_max, y_min, y_max, inputShaft, outputShaft1, outputShaft2, initialY1, initialY2 };
          break;
        }
      case 'motor':
        {
          const { reversed } = thisComponent.export_fn(thisComponent).data;

          const outputShaft = getHShaftID(position[0] + 2, position[1]);

          if (outputShaft === null) {
            break;
          }

          result = { type, compID, position, reversed, outputShaft };
          break;
        }

      case 'multiplier':
        {
          const { factor } = thisComponent.export_fn(thisComponent).data;

          const inputShaft = getVShaftID(position[0] + 2, position[1] - 1);
          const outputShaft = getVShaftID(position[0] + 1, position[1] - 1);
          const multiplicandShaft = getVShaftID(position[0], position[1] - 1);

          if (inputShaft === null || outputShaft === null) {
            break;
          }

          result = { type, compID, position, factor, inputShaft, outputShaft, multiplicandShaft };
          break;
        }
      case "label":
        {
          const { width, height, align, _comment } = thisComponent.export_fn(thisComponent).data;

          const size = [Number(width), Number(height)];
          result = { type, compID, position, size, align, _comment };
          break;
        }
      case "gearPair":
        {
          const { inputRatio, outputRatio } = thisComponent.export_fn(thisComponent).data;

          const shaft1 = getHShaftID(position[0], position[1]);
          const shaft2 = getHShaftID(position[0], position[1] + 1);

          if (shaft1 === null || shaft2 === null) {
            break;
          }

          result = { type, compID, position, inputRatio, outputRatio, shaft1, shaft2 };
          break;
        }
      case "dial":
        {
          const shaft1 = getHShaftID(position[0], position[1]);
          const shaft2 = getVShaftID(position[0], position[1]);

          if (shaft1 === null && shaft2 === null) {
            break;
          }

          result = { type, compID, position, inputShaft: shaft1 ?? shaft2 };
          break;
        }
    }

    if (result === null) {
      result = { type: "unconnected", compID };
    }

    return result;
  });

  /*
  if (thisComponent.componentType === "multiplier") {
      // output 
      component.outputShaft = thisComponent.getAttribute("output");
  }
  else if (thisComponent.componentType === "gear") {
      // input
      component.inputShaft = thisComponent.getAttribute("input");
      // output
      component.outputShaft = thisComponent.getAttribute("output");
  }
  else if (thisComponent.componentType === "functionTable") {
      // input
      component.inputShaft = thisComponent.getAttribute("input");
      // output
      component.outputShaft = thisComponent.getAttribute("output");
  }
  else if (thisComponent.componentType === "integrator") {
      // integrand 
      component.integrandShaft = thisComponent.oninput;
      // variable
      component.variableOfIntegrationShaft = thisComponent.getAttribute("input");
      // output
      component.outputShaft = thisComponent.getAttribute("output");
  }
  else if (thisComponent.componentType === "outputTable") {
      // input
      component.inputShaft = thisComponent.getAttribute("input");
      // outputs
      component.outputShaft1 = thisComponent.getAttribute("output");
      component.outputShaft2 = thisComponent.getAttribute("output");
  }
  else if (thisComponent.componentType === "motor") {
      // output
      component.outputShaft = thisComponent.getAttribute("output");
  }
      */

  const shafts = config1;
  const components: any = config2;
  const constants = (document.querySelector("custom-variables")! as CustomVariablesElement).getText();
  const settings = {
    "custom_variables": constants,
  };

  const config: Config = { shafts, components: components.filter((x: { type: string }) => x.type !== "unconnected"), settings };
  return [config, components.filter((x: { type: string }) => x.type === "unconnected").map((x: { compID: number }) => x.compID)];
}
