import { html, render } from "lit";
import { DraggableComponentElement } from "./DraggableElement.ts";
import { GraphElement } from "./GraphElement.ts";
import { generator } from "../index.ts";
import { openIntegratorPopup, openMultiplierPopup, openGearPairPopup, openFunctionTablePopup, openOutputTablePopup, openCrossConnectPopup, openLabelPopup } from "./Popups.ts"
import { selectShaft } from "./SelectShaft.ts";

import Vector2 from "./Vector2.ts";
import { GRID_SIZE } from "./Grid.ts";
import { GearPairComponentElement } from "./GearPairComponentElement.ts";
import { CrossConnectComponentElement } from "./CrossConnectComponentElement.ts";
import Expression from "@src/expr/Expression.ts";
import { machine } from "./Constants.ts";
import { get_global_ctx } from "@src/Lifecycle.ts";
import { DialComponentElement } from "./DialComponentElement.ts";

export enum ComponentType {
    VShaft,
    HShaft,
    CrossConnect,
    Integrator,
    FunctionTable,
    Differential,
    OutputTable,
    Motor,
    Multiplier,
    Label,
    GearPair,
    Dial,
};

let max_id = 0;
let free_ids: number[] = [];

// export function setIDCounter(id: number): void { CURRENT_ID = id; }

export function stringToComponent(componentName: string): ComponentType | null {
    return ComponentType[componentName as keyof typeof ComponentType];
}

export function createComponent(component: ComponentType): DraggableComponentElement {
    const comp = document.createElement("draggable-component") as DraggableComponentElement;

    comp.classList.add("placed-component")

    comp.style.position = "absolute";

    comp.addEventListener("mouseover", mouseOver);
    comp.addEventListener("mouseleave", mouseLeave);

    setID(comp);

    switch (component) {
        case ComponentType.VShaft:
            createVShaft(comp);
            break;
        case ComponentType.CrossConnect:
            createCrossConnect(comp);
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
        case ComponentType.GearPair:
            createGearPair(comp);
            break;
        case ComponentType.Dial:
            createDial(comp);
            break;
        default:
            console.error("No function defined for component: ", component);
    }

    // Tooltips
    comp.classList.add("tooltip");
    comp.classList.add("top");


    return comp;
}

export function resetIDs(): void {
    free_ids = [];
    max_id = 0;
}

export function deleteComponent(component: DraggableComponentElement): void {
    free_ids.push(component.componentID);
}

export function createUniqueID(): number {
    if (free_ids.length == 0) {
        let id = max_id;
        max_id += 1;
        return id;
    } else {
        let value = free_ids.pop()!;
        return value;
    }
}

function setID(div: DraggableComponentElement): void {
    const v = createUniqueID();
    div.componentID = v
    div.id = "component-" + v;
}

function createVShaft(div: DraggableComponentElement): void {
    div.width = 1;
    div.height = 2;
    div.componentType = "vShaft";
    div.shouldLockCells = false;;

    div.classList.add("vShaft");

    div.addEventListener("click", selectShaft);

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

function createCrossConnect(div: DraggableComponentElement): void {
    div.width = 1;
    div.height = 1;
    div.componentType = "crossConnect";
    div.shouldLockCells = true;
    div.classList.add("crossConnect");

    div.addEventListener("mouseup", openCrossConnectPopup);

    render(html`<cross-connect-component teeth="6" style="width:100%;height:100%"></cross-connect-component>`, div);

    type ExportedData = {
        top: number,
        left: number,
        reversed: boolean;
    };

    div.export_fn = (_this) => {
        const connect = _this.querySelector("cross-connect-component") as CrossConnectComponentElement;
        return {
            _type: ComponentType.CrossConnect,
            data: {
                top: _this.top,
                left: _this.left,
                reversed: connect.inverted,
            },
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        const connect = _this.querySelector("cross-connect-component") as CrossConnectComponentElement;
        _this.top = data.top;
        _this.left = data.left;

        connect.inverted = data.reversed;
    };
}

function createHShaft(div: DraggableComponentElement): void {
    div.width = 2;
    div.height = 1;
    div.componentType = "hShaft";
    div.shouldLockCells = false;;
    div.classList.add("hShaft");

    div.addEventListener("click", selectShaft);

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
    div.width = 4;
    div.height = 2;
    div.componentType = "integrator";
    div.shouldLockCells = true;
    div.classList.add("integrator");
    div.inputRatio = 0;

    render(html`<integrator-component style="width:100%;height:100%"></integrator-component>`, div);

    div.addEventListener("mouseup", openIntegratorPopup);

    type ExportedData = {
        top: number,
        left: number,
        initialPosition: string,
    };

    div.export_fn = (_this) => {
        return {
            _type: ComponentType.Integrator,
            data: {
                top: _this.top,
                left: _this.left,
                initialPosition: _this.dataset.initialValue ?? "0",
            },
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        _this.top = data.top;
        _this.left = data.left;
        _this.dataset.initialValue = data.initialPosition;
    };
}

function createFunctionTable(div: DraggableComponentElement): void {
    div.width = 4;
    div.height = 4;
    div.componentType = "functionTable";
    div.shouldLockCells = true;
    div.classList.add("functionTable");

    div.addEventListener("mouseup", openFunctionTablePopup);

    let graph = document.createElement("graph-table") as GraphElement;
    graph.setAttribute("style", "width:100%;height:100%");
    graph.setAttribute("x-min", "0.0");
    graph.setAttribute("x-max", "10.0");
    graph.setAttribute("y-min", "-1.5");
    graph.setAttribute("y-max", "1.5");
    graph.setAttribute("gantry-x", "0.0");
    graph.setAttribute("padding", "5");
    graph.isAnOutput = false;

    graph.set_data_set("d1", []);

    div.addEventListener("constantschanged", _ => {
        graph.x_min = Expression.eval(div.dataset.x_min ?? `${graph.x_min}`, get_global_ctx());
        graph.x_max = Expression.eval(div.dataset.x_max ?? `${graph.x_max}`, get_global_ctx());
        graph.y_min = Expression.eval(div.dataset.y_min ?? `${graph.y_min}`, get_global_ctx());
        graph.y_max = Expression.eval(div.dataset.y_max ?? `${graph.y_max}`, get_global_ctx());

        let compiled_expr = Expression.compile(graph.data_sets["d1"].fn ?? "0", get_global_ctx());
        let generator_exp = generator(500, graph.x_min, graph.x_max, x => compiled_expr({ x }));
        graph.mutate_data_set("d1", points => {
            points.splice(0, points.length, ...Array.from(generator_exp));
        }, true);
    });

    div.appendChild(graph);

    type ExportedData = {
        top: number,
        left: number,
        x_min: string,
        x_max: string,
        y_min: string,
        y_max: string,
        gantry_x?: number,
        lookup: boolean,
        fn: string,
    };

    div.export_fn = (_this) => {
        let graph_element = _this.querySelector("graph-table") as GraphElement;

        return {
            _type: ComponentType.FunctionTable,
            data: {
                top: _this.top,
                left: _this.left,
                x_min: _this.dataset.x_min ?? String(graph_element.x_min),
                x_max: _this.dataset.x_max ?? String(graph_element.x_max),
                y_min: _this.dataset.y_min ?? String(graph_element.y_min),
                y_max: _this.dataset.y_max ?? String(graph_element.y_max),
                gantry_x: graph_element.gantry_x,
                lookup: (!_this.dataset.lookup) ? false : (_this.dataset.lookup == "1"),
                fn: graph_element.data_sets["d1"]?.fn ?? "",
            }
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        let graph_element = _this.querySelector("graph-table") as GraphElement;

        _this.top = data.top;
        _this.left = data.left;

        _this.dataset.x_min = data.x_min;
        _this.dataset.x_max = data.x_max;
        _this.dataset.y_min = data.y_min;
        _this.dataset.y_max = data.y_max;
        _this.dataset.lookup = (!data.lookup) ? "0" : (data.lookup ? "1" : "0");

        graph_element.x_min = Expression.eval(_this.dataset.x_min, get_global_ctx());
        graph_element.x_max = Expression.eval(_this.dataset.x_max, get_global_ctx());
        graph_element.y_min = Expression.eval(_this.dataset.y_min, get_global_ctx());
        graph_element.y_max = Expression.eval(_this.dataset.y_max, get_global_ctx());
        graph_element.gantry_x = data.gantry_x;

        if (data.fn !== undefined && data.fn != "") {
            let compiled_expr = Expression.compile(data.fn, get_global_ctx());
            let generator_exp = generator(500, graph.x_min, graph.x_max, x => compiled_expr({ x }));
            graph_element.set_data_set("d1", Array.from([...generator_exp]));
            graph_element.data_sets["d1"].fn = data.fn;
        }
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
    div.width = 4;
    div.height = 4;
    div.componentType = "outputTable";
    div.shouldLockCells = true;
    div.classList.add("outputTable");
    div.inputRatio = 0;
    div.outputRatio = 0;

    div.addEventListener("mouseup", openOutputTablePopup);

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

    graph.set_data_set("d1", [{ x: 0, y: 0 }], "blue");
    graph.set_data_set("d2", [{ x: 0, y: 0 }], "red", true);
    graph.isAnOutput = true;

    div.addEventListener("constantschanged", _ => {
        graph.x_min = Expression.eval(div.dataset.x_min ?? `${graph.x_min}`, get_global_ctx());
        graph.x_max = Expression.eval(div.dataset.x_max ?? `${graph.x_max}`, get_global_ctx());
        graph.y_min = Expression.eval(div.dataset.y_min ?? `${graph.y_min}`, get_global_ctx());
        graph.y_max = Expression.eval(div.dataset.y_max ?? `${graph.y_max}`, get_global_ctx());

        let compiled_expr = Expression.compile(graph.data_sets["d1"].fn ?? "0", get_global_ctx());
        let generator_exp = generator(500, graph.x_min, graph.x_max, x => compiled_expr({ x }));
        graph.mutate_data_set("d1", points => {
            points.splice(0, points.length, ...Array.from(generator_exp));
        }, true);
    });

    type ExportedData = {
        top: number,
        left: number,
        x_min: string,
        x_max: string,
        y_min: string,
        y_max: string,
        initialY1: string,
        initialY2: string,
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
                x_min: _this.dataset.x_min ?? String(graph_element.x_min),
                x_max: _this.dataset.x_max ?? String(graph_element.x_max),
                y_min: _this.dataset.y_min ?? String(graph_element.y_min),
                y_max: _this.dataset.y_max ?? String(graph_element.y_max),
                gantry_x: graph_element.gantry_x,
                initialY1: _this.dataset.initial_1 ?? String(_this.inputRatio),
                initialY2: _this.dataset.initial_2 ?? String(_this.outputRatio),
            }
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        let graph_element = _this.querySelector("graph-table") as GraphElement;

        _this.top = data.top;
        _this.left = data.left;

        _this.dataset.x_min = data.x_min;
        _this.dataset.x_max = data.x_max;
        _this.dataset.y_min = data.y_min;
        _this.dataset.y_max = data.y_max;
        _this.dataset.initial_1 = (data.initialY1) ?? "0";
        _this.dataset.initial_2 = data.initialY2 ?? "0";

        graph_element.x_min = Expression.eval(_this.dataset.x_min, get_global_ctx());
        graph_element.x_max = Expression.eval(_this.dataset.x_max, get_global_ctx());
        graph_element.y_min = Expression.eval(_this.dataset.y_min, get_global_ctx());
        graph_element.y_max = Expression.eval(_this.dataset.y_max, get_global_ctx());
        graph_element.gantry_x = data.gantry_x;
        _this.inputRatio = Expression.eval(_this.dataset.initial_1, get_global_ctx());
        _this.outputRatio = Expression.eval(_this.dataset.initial_2, get_global_ctx());
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

    type ExportedData = {
        top: number,
        left: number,
        reversed: boolean;
    };

    div.export_fn = (_this) => {
        return {
            _type: ComponentType.Motor,
            data: {
                top: _this.top,
                left: _this.left,
                reversed: _this.outputRatio < 0,
            },
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        _this.top = data.top;
        _this.left = data.left;
        _this.outputRatio = (!data.reversed) ? 1 : (data.reversed ? -1 : 1);
    };
}

function createMultiplier(div: DraggableComponentElement): void {
    div.width = 3;
    div.height = 2;
    div.componentType = "multiplier";
    div.shouldLockCells = true;
    div.classList.add("multiplier");

    div.addEventListener("mouseup", openMultiplierPopup);

    render(html`<multiplier-component style="width:100%;height:100%"></multiplier-component>`, div);

    type ExportedData = {
        top: number,
        left: number,
        factor: string,
    };

    div.export_fn = (_this) => {
        return {
            _type: ComponentType.Multiplier,
            data: {
                top: _this.top,
                left: _this.left,
                factor: _this.dataset.factor ?? "1"
            },
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        _this.top = data.top;
        _this.left = data.left;
        _this.dataset.factor = data.factor ?? "1";
    };
}

function createLabel(div: DraggableComponentElement): void {
    div.width = 3;
    div.height = 1;
    div.componentType = "label";
    div.shouldLockCells = false;

    div.classList.add("label");

    div.addEventListener("mouseup", openLabelPopup);

    let render_p = () => {
        const para = div.querySelector("p") as HTMLParagraphElement;
        let align = "center";
        if (para != null) {
            align = para.style.textAlign;
        }

        render(html`<p style="color:black;text-align: center;font-size:${GRID_SIZE / 2}px;width:100%;padding:2px;margin:0;">This is a label</p>`, div);

        if (para != null) {
            para.style.textAlign = align;
        }
    }

    machine.addEventListener("wheel", render_p);
    machine.addEventListener("touchmove", e => { if (e.touches.length == 2) render_p(); });
    render_p();

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

function createGearPair(div: DraggableComponentElement): void {
    div.width = 1;
    div.height = 2;
    div.componentType = "gearPair";
    div.shouldLockCells = true;
    div.classList.add("gearPair");

    div.addEventListener("mouseup", openGearPairPopup);

    render(html`<gear-pair-component style="width:100%;height:100%"></gear-pair-component>`, div);

    type ExportedData = {
        top: number,
        left: number,
        inputRatio: number;
        outputRatio: number;
    };

    div.export_fn = (_this) => {
        const gear_pair = _this.querySelector("gear-pair-component") as GearPairComponentElement;
        return {
            _type: ComponentType.GearPair,
            data: {
                top: _this.top,
                left: _this.left,
                inputRatio: gear_pair.ratio_top,
                outputRatio: gear_pair.ratio_bottom,
            },
        };
    };

    div.import_fn = (_this, data: ExportedData) => {
        const gear_pair = _this.querySelector("gear-pair-component") as GearPairComponentElement;
        _this.top = data.top;
        _this.left = data.left;
        gear_pair.ratio_top = data.inputRatio ?? 1;
        gear_pair.ratio_bottom = data.outputRatio ?? 1;
    };
}

function createDial(div: DraggableComponentElement): void {
    div.width = 1;
    div.height = 1;
    div.componentType = "dial";
    div.shouldLockCells = true;
    div.classList.add("dial");

    render(html`<dial-component style="width:100%;height:100%"></dial-component>`, div);

    type ExportedData = {
        top: number,
        left: number,
    };

    div.export_fn = (_this) => {
        return {
            _type: ComponentType.Dial,
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

function createTooltipElement(): HTMLDivElement {
    let div = document.querySelector("#component-tooltip") as HTMLDivElement;
    if (div != undefined) return div;

    let span = document.createElement("span") as HTMLSpanElement;
    span.classList.add("tooltiptext");

    div = document.createElement("div") as HTMLDivElement;
    div.id = "component-tooltip";
    div.appendChild(span);
    div.classList.add("tooltip");
    div.classList.add("top");

    return div;
}


function mouseOver(e: MouseEvent): void {
    const component = e.currentTarget as DraggableComponentElement;
    let componentTooltip = document.querySelector("#component-tooltip") as HTMLSpanElement | undefined;

    if (!componentTooltip) {
        componentTooltip = createTooltipElement()
    }
    let span = componentTooltip.querySelector("span")!;

    let end = true;

    switch (component.componentType) {
        case "dial":
            const dial = component.querySelector("dial-component")! as (DialComponentElement);
            dial.tooltip = span;
            dial.updateTooltip();
            end = false;

        default:
            if (component.classList.contains("warning")) {
                end = false;
                span.textContent = "Component is missing required connections";
                break;
            } else if (component.classList.contains("unconnected")) {
                end = false;
                span.textContent = "Component has no powered input";
                break;
            } else if (component.classList.contains("error")) {
                end = false;
                span.textContent = "A Shaft is being driven by two inputs";
                break;
            }
    }

    if (end) { componentTooltip.remove(); return };

    span.style.visibility = "visible";
    span.style.opacity = "1";
    span.style.transform = "translate(-50%, -100%)";

    let pos = component.getScreenPosition();
    let size = component.getSize();
    componentTooltip.style.left = `${pos.x + size.x / 2}px`;
    componentTooltip.style.top = `${pos.y}px`;
    componentTooltip.style.position = "absolute";

    document.querySelector("#machine")!.appendChild(componentTooltip);
}

function mouseLeave(e: MouseEvent): void {
    const component = e.currentTarget as DraggableComponentElement;
    let componentTooltip = document.querySelector("#component-tooltip") as HTMLSpanElement | undefined;

    if (!componentTooltip) { return; }

    switch (component.componentType) {
        case "dial":
            const dial = component.querySelector("dial-component")! as (DialComponentElement);
            dial.tooltip = undefined;
            break;
    }
    document.querySelector("#machine")?.removeChild(componentTooltip);
}
