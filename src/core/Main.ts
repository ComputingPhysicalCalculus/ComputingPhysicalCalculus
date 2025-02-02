import { Shaft } from "./Shaft";
import { Motor } from "./Motor";
import { OutputTable } from "./OutputTable";

var shafts: Shaft[];
var motor: Motor;
var outputTables: OutputTable[];

function simulate_one_cycle(): void {
    let stack: Shaft[] = [motor.getOutput()];
    while(stack.length > 0) {
        let shaft = stack.pop()!;
        for(const device of shaft.outputs) {
            let output = device.getOutput();
            if(!output) continue;
            stack.push(output);
        }
    }
}

function update(): void {
    for(const shaft of shafts) {
        shaft.update();
    }
    for(const outputTable of outputTables) {
        outputTable.addPlot();
    }
}

/*
 TODO: 
 1. have some sort of initialization function to initial global variables
 2. have a main function to repeatedly call simulate_one_cycle and update
 */