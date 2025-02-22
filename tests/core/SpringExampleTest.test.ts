import { Simulator } from "../../src/core/Main";
import { test, expect, suite } from 'vitest'
import { SPRING_EXAMPLE } from "../../src/examples";
import util from 'node:util';

function testFunction(x: number): number {
    return 4 * x;
}

let test_data: [number, number][] = [];
for (let a = 10; a < 20; a++)
    for (let b = 1; b < 20; b++)
        test_data.push([a, b]);

test("Testing the example from slides", () => {
    let simulator = new Simulator(SPRING_EXAMPLE, 0.01, 0, testFunction);

    for (let i = 0; i < 30; i++){
        simulator.step();
    }
    
    console.log(simulator.outputTables[0].y2History);
});
