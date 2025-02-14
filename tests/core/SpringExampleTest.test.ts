import { Simulator } from "../../src/core/Main";
import { test, expect, suite } from 'vitest'
import { EXAMPLE_CONFIG } from "../../src/examples";

function testFunction(x: number): number {
    return 4 * x;
}

let test_data: [number, number][] = [];
for (let a = 10; a < 20; a++)
    for (let b = 1; b < 20; b++)
        test_data.push([a, b]);

test("Testing the example from slides", () => {
    let simulator = new Simulator(EXAMPLE_CONFIG, 1, 0, 1, 0, testFunction);
    for (let i = 0; i < 30; i++){
        simulator.step();
        let y1_length = simulator.outputTables[0].y1History.length;
        // console.log(y1_length);
        // console.log(simulator.outputTables[0].y1History[y1_length - 1]);
    }
});