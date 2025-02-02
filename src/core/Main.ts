import { Shaft } from "./Shaft";
import { Motor } from "./Motor";

var shafts: Shaft[];
var motor: Motor;

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
}
