/**
 * @file Main.ts
 * @description This file contains functions to simulate the differential analyzer
 * @author Andy Zhu
 */

import { Shaft } from "./Shaft";
import { Motor } from "./Motor";
import { OutputTable } from "./OutputTable";

var shafts: Shaft[];
var motor: Motor;
var outputTables: OutputTable[];

/**
 * @function simulate_one_cycle
 * @description simulates one cycle of the differential analyzer using topological sort
 * @return void
 */
function simulate_one_cycle(): void {
    let stack: Shaft[] = [motor.getOutput()];
    while (stack.length > 0) {
        let shaft = stack.pop()!;
        for (const device of shaft.outputs) {
            let output = device.getOutput();
            if (!output) continue;
            stack.push(output);
        }
    }
}

/**
 * @function update
 * @description update the value of all shafts and call addPlot on all outputTable
 * @return void
 */
function update(): void {
    for (const shaft of shafts) {
        shaft.update();
    }
    for (const outputTable of outputTables) {
        outputTable.addPlot();
    }
}

/**
 * @function init
 * @description used to pass in global variable from UI
 * @param shafts list of shafts we are working with
 * @param motor the motor object from UI
 * @param outputTables list of outputTable from UI
 * @return void
 */
function init(shafts: Shaft[], motor: Motor, outputTables: OutputTable[]): void {
    (globalThis as any).shafts = shafts;
    (globalThis as any).motor = motor;
    (globalThis as any).outputTables = outputTables;
}

function run() {
    // TODO:
    // 
    while (true) {
        simulate_one_cycle();
        update();
    }
}

/*
 TODO: 
 2. have a main function to repeatedly call simulate_one_cycle and update
 */
