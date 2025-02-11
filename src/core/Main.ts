/**
 * @file Main.ts
 * @description This file contains functions to simulate the differential analyzer
 * @author Andy Zhu, Hanzhang Shen
 */

import { Device } from "./Device.js";
import { Differential } from "./Differential.js";
import { FunctionTable } from "./FunctionTable.js";
import { Integrator } from "./Integrator.js";
import { Motor } from "./Motor.js";
import { Multiplier } from "./Multiplier.js";
import { OutputTable } from "./OutputTable.js";
import { Shaft } from "./Shaft.js";
// import config from "../../ExampleConfig.json";
import { Config } from "../config.js";

export class Simulator {
    shafts: Shaft[] = [];
    motor: Motor;
    outputTables: OutputTable[] = [];
    components: Device[] = [];

    constructor(shafts: Shaft[], motor: Motor, outputTables: OutputTable[], components: Device[]) {
        this.shafts = shafts;
        this.motor = motor;
        this.outputTables = outputTables;
        this.components = components;
    }

    /**
     * @function simulate_one_cycle
     * @description simulates one cycle of the differential analyzer using topological sort
     * @return void
     * @author Andy Zhu
     */
    simulate_one_cycle(): void {
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

    // /**
    //  * @function init
    //  * @description used to pass in global variable from UI
    //  * @param shafts list of shafts we are working with
    //  * @param motor the motor object from UI
    //  * @param outputTables list of outputTable from UI
    //  * @return void
    //  * @author Andy Zhu
    //  */
    // init(shafts: Shaft[], motor: Motor, outputTables: OutputTable[]): void {
    //     (globalThis as any).shafts = shafts;
    //     (globalThis as any).motor = motor;
    //     (globalThis as any).outputTables = outputTables;
    // }

    /**
     * @function parse_config
     * @description parse the config file and create the corresponding shafts and devices
     * @param config the config file
     * @return void
     * @author Hanzhang Shen
     */
    static parse_config(config: Config): Simulator {
        let shafts = [];
        let components = [];
        let outputTables = [];
        let motor = undefined;

        const rotation: number = 1; // rotation of the motor
        const initial_x_position: number = 0; // initial x position of the function table
        const initialY1: number = 0; // initial y1 position of the output table
        const initialY2: number = 0; // initial y2 position of the output table

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
                        Math.sin // TODO: hardcoded for now to test the engine
                    );
                    shafts[component.inputShaft].outputs.push(new_component);
                    components.push(new_component);
                    break;

                case 'motor':
                    if (motor)
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

        if (motor === undefined) {
            throw new Error("The configuration must have at least one motor");
        }

        return new Simulator(shafts, motor, outputTables, components);
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

