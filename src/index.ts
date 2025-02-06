// import { InputGraph, OutputGraph } from "./UI/Graph";
// import Vector2 from "./UI/Vector2";

// Required to register components
import "./UI/IntegratorComponent";
import "./UI/GraphElement";
import "./UI/DraggableElement";
import "./UI/GraphElement";
import "./UI/ShaftElement";
import "./UI/MotorComponent";
import "./UI/GearComponentElement";
import "./UI/DifferentialComponentElement";

import { setupDragHooks } from "./UI/Drag";
import { setupPopups } from "./UI/Components.ts";
import { Config, downloadConfig, loadConfig } from "./config.ts";
import _example_config from "../integrating-linear.json";
import { Simulator } from "./core/Main.ts";
import { GraphElement } from "./UI/GraphElement";
import Vector2 from "./UI/Vector2.ts";

export const EXAMPLE_CONFIG: Config = _example_config as any;

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

// Sorry for the gobal
let current_config: Config | null = null;

function setup(): void {
    let import_button = document.getElementById("import-button") as HTMLButtonElement;
    let export_button = document.getElementById("export-button") as HTMLButtonElement;
    let file_picker = document.getElementById("config-file-upload") as HTMLInputElement;
    let run_button = document.getElementById("run-simulation") as HTMLButtonElement;
    let steps_input = document.getElementById("step-counter") as HTMLInputElement;
    let step_period_input = document.getElementById("step-period") as HTMLInputElement;

    export_button.addEventListener("click", _ => {
        // TODO: Generate config
        
        downloadConfig(EXAMPLE_CONFIG)
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

            current_config = JSON.parse(content.toString()) as Config;
            loadConfig(current_config);
        }
    });
    run_button.addEventListener("click", _ => {
        // Generate config
        
        let steps = Number(steps_input.value);
        let step_period = Number(step_period_input.value);

        if (steps <= 0 || step_period < 0 || current_config === null) {
            return;
        }
        
        let simulator = Simulator.parse_config(current_config);
        simulator.motor.changeRotation(step_period);

        // for (let i = 0; i < steps; i++) {
        //     simulator.step();
        // }
        let i = 0;
        const step_function = () => {
            if (i >= steps) {
                return;
            }

            simulator.step();

            if (simulator.outputTables.length > 0) {
                let output_graph = document.querySelector(".outputTable > graph-table") as GraphElement | null;
                if (output_graph !== null && output_graph !== undefined) {
                    let table = simulator.outputTables[0];

                    output_graph.mutate_data_set("1", points => {
                        let set_1 = [];
                        for (let i = 0; i < table.xHistory.length; i++) {
                            set_1.push(new Vector2(table.xHistory[i], table.y1History[i]));
                        }

                        output_graph.gantry_x = table.xHistory[table.xHistory.length - 1];
                        
                        points.splice(0, points.length, ...set_1)
                    });

                    output_graph.mutate_data_set("2", points => {
                        if (table.y2History === undefined) {
                            return;
                        }
                        let set_2 = []
                        for (let i = 0; i < table.xHistory.length; i++) {
                            set_2.push(new Vector2(table.xHistory[i], table.y2History[i]));
                        }

                        points.splice(0, points.length, ...set_2);
                    })
                }
            }
            
            i += 1;

            window.setTimeout(step_function, step_period * 1000.0);
        }

        step_function();
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
