import { Simulator } from "../../src/core/Main";
import { Integrator } from "../../src/core/Integrator";
import { test, expect, suite } from 'vitest'
import { SPRING_EXAMPLE, LINEAR_INTEGRATION_EXAMPLE } from "../../src/examples";
import { PPMC, binary_search, MSE } from "./TestingUtil.ts";
import fs from 'fs';
import util from 'node:util';


const WRITE_TO_FILE = true;


// F is the function to be integrated
// I is the integrated function
function test_linear(F: (v: number) => number, I: (v: number) => number, x_init: number) {
    // number of cycles
    const N = 1000;
    // test statistic
    const PPMC_THRESHOLD = 0.99999;
    const MSE_THRESHOLD = 0.1;

    // create simulator with the initial conditions based on F and I
    let simulator = new Simulator(LINEAR_INTEGRATION_EXAMPLE, 6 / N, x_init, F);

    // manually override the histories
    simulator.outputTables[0].y1History = [F(x_init)];
    simulator.outputTables[0].y2History = [I(x_init)];

    // manually set the disk position as its set to 0 in the config file
    for (const device of simulator.components) {
        if (device instanceof Integrator) {
            (device as any).diskPosition = F(x_init);
        }
    }

    const OBJS = false;
    const PRINT = false;

    // manual debugginging only
    if (PRINT) {
        for (const s of simulator.shafts) {
            if (OBJS) {
                for (const o of s.outputs) {
                    console.dir(o);
                    console.log("\n\n\n\n");
                }
            }
            else {
                console.log(util.inspect(s, { depth: 4, colors: true }));
                console.log("\n\n\n\n");
            }
            console.log("\n");
        }
    }

    for (let i = 0; i < N; i++) {
        simulator.step();
    }

    let t = simulator.outputTables[0].xHistory;
    let ft = simulator.outputTables[0].y1History;
    let integrated = simulator.outputTables[0].y2History!;

    let ft_true = Array.from({ length: N + 1 }, (_, i) => F(x_init + t[i]));
    let integrated_true = Array.from({ length: N + 1 }, (_, i) => I(x_init + t[i]));


    if (WRITE_TO_FILE) {
        const lines: string[] = [];
        for (let i = 0; i < ft.length; i++) {
            const line = `${x_init + t[i]}, ${integrated[i]}, ${integrated_true[i]}`;
            lines.push(line);
        }

        fs.writeFileSync("tests/core/data2.txt", lines.join('\n'), 'utf-8');
    }

    // compare f(t)
    let r1 = PPMC(ft, ft_true);
    let m1 = MSE(ft, ft_true);

    expect(r1).toBeGreaterThan(PPMC_THRESHOLD);
    expect(m1).toBeLessThan(MSE_THRESHOLD);

    // compare integrated
    let r2 = PPMC(integrated, integrated_true);
    let m2 = MSE(integrated, integrated_true);

    expect(r2).toBeGreaterThan(PPMC_THRESHOLD);
    expect(m2).toBeLessThan(MSE_THRESHOLD);
}


// tests integrals:
// sin(t) -> -cos(t)
// t -> 0.5 t^2
// t^2 -> 1/3 t^3
// t^3 -> 0.25 t^4
// 1/(t^2 + 1) -> arctan(t)
// 1/t -> ln(t)
function test_multiple_linears() {
    test_linear(Math.sin, (v: number) => -Math.cos(v), 0);
    test_linear((v: number) => v, (v: number) => 0.5 * v * v, 0);
    test_linear((v: number) => v * v, (v: number) => 1 / 3 * Math.pow(v, 3), 0);
    test_linear((v: number) => v * v * v, (v: number) => 1 / 4 * Math.pow(v, 4), 0);
    test_linear((v: number) => 1 / (v * v + 1), (v: number) => Math.atan(v), 0);
    test_linear((v: number) => 1 / (v), (v: number) => Math.log(v), 1);
}


test("Testing the Linear Integration Test", test_multiple_linears)
