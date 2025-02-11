/**
 * @file Main.ts
 * @description This file contains functions to simulate the differential analyzer
 * @author Andy Zhu, Hanzhang Shen
 */

import { Device } from "./Device";
import { Differential } from "./Differential";
import { FunctionTable } from "./FunctionTable";
import { Integrator } from "./Integrator";
import { Motor } from "./Motor";
import { Multiplier } from "./Multiplier";
import { OutputTable } from "./OutputTable";
import { Shaft } from "./Shaft";
import { EXAMPLE_CONFIG } from "../examples";
import { Config } from "../config";
import { Gear } from "./Gear.js";

export class Simulator {
    shafts: Shaft[] = [];
    motor: Motor | undefined;
    outputTables: OutputTable[] = [];
    components: Device[] = [];

    constructor(config ? : Config) {
        if (config !== undefined)
            this.parse_config(config);
    }

    /**
     * @function simulate_one_cycle
     * @description simulates one cycle of the differential analyzer using topological sort
     * @return void
     * @author Andy Zhu
     */
    simulate_one_cycle(): void {
        if (this.motor === undefined) {
            throw new Error("The configuration must have at least one motor");
        }
        let stack: Shaft[] = [this.motor.getOutput()];
        let visited: Set<number> = new Set<number>();
        visited.add(stack[0].id);
        while (stack.length > 0) {
            let shaft = stack.pop()!;
            for (const device of shaft.outputs) {
                let output = device.getOutput();
                if (!output) continue;
                if (!visited.has(output.id)) {
                    stack.push(output);
                    visited.add(output.id);
                }
            }
        }
    }

    /**
     * @function update
     * @description update the value of all shafts and call addPlot on all outputTable
     * @return void
     * @author Andy Zhu
     */
    update(): void {
        for (const shaft of this.shafts) {
            shaft.update();
        }
        for (const outputTable of this.outputTables) {
            outputTable.addPlot();
        }
    }

    step() {
        this.simulate_one_cycle();
        this.update();
    }

    /**
     * @function parse_config
     * @description parse the config file and create the corresponding shafts and devices
     * @param config the config file
     * @return void
     * @author Hanzhang Shen
     */
    parse_config(config: Config): void {
        console.log("Parsing the configurationf file and instantiating shafts and components.")
        let shafts = [];
        let components = [];
        let outputTables = [];
        let motor = undefined;

        const rotation: number = 1; // rotation of the motor
        const initial_x_position: number = 0; // initial x position of the function table
        const initialY1: number = 0; // initial y1 position of the output table
        const initialY2: number = 0; // initial y2 position of the output table
        const inputFunction: (n: number) => number = Math.sin;

        // create the shafts
        for (const shaft of config.shafts) {
            shafts.push(new Shaft(shaft.id, []));
        }

        // create the components
        for (const component of config.components) {
            let new_component: Device;
            switch (component.type) {
                case 'differential':
                    new_component = new Differential(
                        shafts[component.inputShaft1],
                        shafts[component.inputShaft2],
                        shafts[component.outputShaft]
                    );
                    shafts[component.inputShaft1].outputs.push(new_component);
                    shafts[component.inputShaft2].outputs.push(new_component);
                    shafts[component.outputShaft].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'integrator':
                    new_component = new Integrator(
                        shafts[component.variableOfIntegrationShaft],
                        shafts[component.integrandShaft],
                        shafts[component.outputShaft],
                        component.reverse,
                        component.initialPosition
                    );
                    shafts[component.variableOfIntegrationShaft].outputs.push(new_component);
                    shafts[component.integrandShaft].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'multiplier':
                    new_component = new Multiplier(
                        shafts[component.inputShaft],
                        shafts[component.outputShaft],
                        component.factor
                    );
                    shafts[component.inputShaft].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'gear':
                    new_component = new Multiplier(
                        shafts[component.horizontal],
                        shafts[component.vertical],
                        1
                    );
                    shafts[component.horizontal].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'functionTable':
                    new_component = new FunctionTable(
                        shafts[component.inputShaft],
                        shafts[component.outputShaft],
                        initial_x_position,
                        inputFunction // TODO: hardcoded for now to test the engine
                    );
                    shafts[component.inputShaft].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'motor':
                    if (this.motor)
                        throw new Error('Only one motor is allowed.');
                    motor = new Motor(
                        rotation,
                        shafts[component.outputShaft]
                    );
                    components.push(motor);
                    break;

                case 'outputTable':
                    let outputTable: OutputTable;
                    if (component.outputShaft2 && initialY2) {
                        outputTable = new OutputTable(
                            shafts[component.inputShaft],
                            shafts[component.outputShaft1],
                            initialY1,
                            shafts[component.outputShaft2],
                            initialY2
                        );
                    } else {
                        outputTable = new OutputTable(
                            shafts[component.inputShaft],
                            shafts[component.outputShaft1],
                            initialY1,
                        );
                    }

                    shafts[component.inputShaft].outputs.push(outputTable);
                    shafts[component.outputShaft1].outputs.push(outputTable);
                    if (component.outputShaft2) {
                        shafts[component.outputShaft2].outputs.push(outputTable);
                    }
                    components.push(outputTable);
                    outputTables.push(outputTable);
                    break;

                default:
                    throw new Error(`Invalid component type`);
            }
        }

        this.motor = motor;
        this.shafts = shafts;
        this.outputTables = outputTables;
        this.components = components
        console.log("Finished parsing the configuration file and instantiating the objects.")
    }
}

// export function run(): void {
//     parse_config(config);
//     init(shafts, motor, outputTables);
//     for (let i = 0; i < 100; i++) {
//         simulate_one_cycle();
//         update();
//     }
// }

