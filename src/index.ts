// import { InputGraph, OutputGraph } from "./UI/Graph";
// import Vector2 from "./UI/Vector2";

// Required to register components
import "./UI/IntegratorComponent";
import "./UI/GraphElement";
import "./UI/DraggableElement";
import "./UI/GraphElement";
import "./UI/ShaftElement";
import "./UI/MotorComponent";

import { setupDragHooks } from "./UI/Drag";
import { setupPopups } from "./UI/Components.ts";
import { Config, downloadConfig, loadConfig } from "./config.ts";
import example_config from "../ExampleConfig.json";

// import exampleConfig from "../ExampleConfig.json";


// let canvasElement: HTMLCanvasElement;
// let canvasCtx: CanvasRenderingContext2D;
// let graph: OutputGraph;
// let input_graph: InputGraph;

window.onload = setup;

export const generator = function*(n: number, min: number, max: number, f: (x: number) => number) {
    for (let i = min; i < max; i += (max - min) / n) {
        yield { x: i, y: f(i) };
    }
}

function setup(): void {
    let import_button = document.getElementById("import-button") as HTMLButtonElement;
    let export_button = document.getElementById("export-button") as HTMLButtonElement;
    let file_picker = document.getElementById("config-file-upload") as HTMLInputElement;

    export_button.addEventListener("click", _ => {
        // TODO: Generate config
        
        downloadConfig(example_config as Config)
    });
    import_button.addEventListener("click", _ => {
        let file = file_picker.files?.[0];
        if (file === null || file === undefined) {
            return;
        }

        let reader = new FileReader();
        reader.readAsText(file, "utf-8");

        reader.onload = e => {
            let content = e.target?.result;
            if (content === null || content === undefined) {
                return;
            }

            loadConfig(JSON.parse(content.toString()) as Config);
        }
    });
    
    // let i = document.createElement("integrator-component");
    // i.setAttribute("style", "position:absolute;left:50%;bottom:50%");
    // i.setAttribute("leg-one", "80");
    // i.setAttribute("leg-two", "25");
    // i.setAttribute("leg-three", "60");
    // document.body.appendChild(i);

    // let graph = document.getElementById("graph-table-1") as GraphElement;
    // let generator_exp = generator(1000, graph.x_min, graph.x_max, x => Math.exp(x));
    // let generator_exp_1 = generator(1000, graph.x_min, graph.x_max, x => 0.5 * Math.exp(x));
    // let generator_exp_2 = generator(1000, graph.x_min, graph.x_max, x => 0.25 * Math.exp(x));

    // graph.set_data_set("a", Array.from([
    //     { x: 0.0, y: 1.0 },
    //     { x: 1.0, y: 1.0 },
    // ]));
    // graph.set_data_set("a", Array.from([...generator_exp]));
    // graph.set_data_set("b", Array.from([...generator_exp_1]), "red");
    // graph.set_data_set("c", Array.from([...generator_exp_2]), "green");

    setupPopups();
    setupDragHooks();
}
