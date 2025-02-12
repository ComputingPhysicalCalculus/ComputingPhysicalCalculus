import { isTemplateResult } from "lit/directive-helpers.js";
import { ComponentType } from "./UI/Components.ts";
import { DraggableComponentElement } from "./UI/DraggableElement.ts";
import Vector2 from "./UI/Vector2.ts";
import { Config } from "./config";
// used to configure parameters and initial setings
// go from UI to config which can be saved and loaded 

// asumming valid config is checked as we build

// take a component, get it's name, location/position, 
export function toConfig(): Config {
    //  iterate through
    // console.log("hello");
    const elements = document.querySelectorAll(".placed-component") as NodeListOf<DraggableComponentElement>;
    console.log(elements);
    const shaftElements = Array.from(elements).filter(element => element.componentType.endsWith("Shaft"));
    console.log(shaftElements);
    const config1 = Array.from(shaftElements).map((thisComponent) => {
        // for shafts
        if ((thisComponent.componentType === "vShaft") || (thisComponent.componentType === "hShaft")) {
            // id
            const id = thisComponent.componentID;
            // position
            const start = [Number(thisComponent.left), Number(thisComponent.top)];

            const shaft : any = {id, start};

            // if vertical
            if (thisComponent.componentType === "vShaft") {
                // height
                // shaft.height = thisComponent.height;
                shaft.end = [Number(thisComponent.left),Number(thisComponent.top)+thisComponent.height-1];
            }
            // if horizontal
            else if (thisComponent.componentType === "hShaft") {
                // width
                // shaft.width = thisComponent.width;
                shaft.end = [Number(thisComponent.left)+thisComponent.width-1,Number(thisComponent.top)];
            }
            // remove this shaft from the list of components
            // elements.remove(thisComponent); 
            return shaft; 
        }
    });

    const componentElements = Array.from(elements).filter(element => !element.componentType.endsWith("Shaft"));
    console.log(componentElements);
    // for all components
    const config2 = Array.from(componentElements).map((thisComponent) => {

        if (thisComponent.componentType === "label") {

            const {_type, data: {top, left, width, height, align, _comment}} = thisComponent.export_fn(thisComponent);
            
            const position = [Number(left),Number(top)];
            const size = [Number(width),Number(height)];
            console.log(size);
            const type = "label";
            const id = thisComponent.componentID;
            console.log(_comment);
            const component : any = {type, id, position, size, align, _comment};
            console.log(component);
            return component;
        }
        else {
            //type 
            const type = thisComponent.componentType;
            // id
            const id = thisComponent.componentID;
            // position
            const position = [Number(thisComponent.left),Number(thisComponent.top)];

            const component : any = {type, id, position};
            return component;
        }
        
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
        
    });

    const shafts = config1;
    const components = config2;
    const config : Config = {shafts, components};
    console.log(JSON.stringify(config));
    return config;
}