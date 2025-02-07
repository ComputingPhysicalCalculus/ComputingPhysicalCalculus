// function setup(): void {
//     let run_button = document.getElementById("run-simulation") as HTMLButtonElement;

//     run_button.addEventListener("click", _ => {
//         // Generate config

//         let steps = Number(steps_input.value);
//         let step_period = Number(step_period_input.value);

//         if (steps <= 0 || step_period < 0 || current_config === null) {
//             return;
//         }

//         let simulator = Simulator.parse_config(current_config);
//         simulator.motor.changeRotation(step_period);

//         // for (let i = 0; i < steps; i++) {
//         //     simulator.step();
//         // }
//         let i = 0;
//         const step_function = () => {
//             if (i >= steps) {
//                 return;
//             }

//             simulator.step();

//             if (simulator.outputTables.length > 0) {
//                 let output_graph = document.querySelector(".outputTable > graph-table") as GraphElement | null;
//                 if (output_graph !== null && output_graph !== undefined) {
//                     let table = simulator.outputTables[0];

//                     output_graph.mutate_data_set("1", points => {
//                         let set_1 = [];
//                         for (let i = 0; i < table.xHistory.length; i++) {
//                             set_1.push(new Vector2(table.xHistory[i], table.y1History[i]));
//                         }

//                         output_graph.gantry_x = table.xHistory[table.xHistory.length - 1];

//                         points.splice(0, points.length, ...set_1)
//                     });

//                     output_graph.mutate_data_set("2", points => {
//                         if (table.y2History === undefined) {
//                             return;
//                         }
//                         let set_2 = []
//                         for (let i = 0; i < table.xHistory.length; i++) {
//                             set_2.push(new Vector2(table.xHistory[i], table.y2History[i]));
//                         }

//                         points.splice(0, points.length, ...set_2);
//                     })
//                 }
//             }

//             i += 1;

//             window.setTimeout(step_function, step_period * 1000.0);
//         }

//         step_function();
//     });
// }
