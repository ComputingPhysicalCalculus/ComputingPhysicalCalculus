import { Simulator } from "../../src/core/Main";
import { test, expect } from 'vitest'
import { OSCILLATION_EXAMPLE } from "../../src/examples";
import { MSE } from "./TestingUtil.ts";

function test_run(F: (v: number) => number, DXDT: (v: number) => number) {
    // number of cycles
    const N = 1000;

    // test statistic
    const MSE_THRESHOLD = 1;

    // create simulator with the initial conditions based on F and I
    let simulator = new Simulator(OSCILLATION_EXAMPLE, 0.001, 0);

    for (let i = 0; i < N; i++) {
        simulator.step();
    }

    let t = simulator.outputTables[0].xHistory;
    let x_t = simulator.outputTables[0].y1History;
    let dx_dt = simulator.outputTables[0].y2History!;
    console.log(x_t)

    let xt_true = Array.from({ length: N + 1 }, (_, i) => F(t[i]));
    let dx_true = Array.from({ length: N + 1 }, (_, i) => DXDT(t[i]));

    let m1 = MSE(x_t, xt_true);
    let m2 = MSE(dx_dt, dx_true);

    expect(m1).toBeLessThan(MSE_THRESHOLD);
    expect(m2).toBeLessThan(MSE_THRESHOLD);
}

function test_oscillation() {
    test_run(
        (v: number) => Math.pow(Math.E, -2 * v) * (1 - 3 * Math.pow(Math.E, v)),
        (v: number) => -2 * Math.pow(Math.E, -2 * v) + 3 * Math.pow(Math.E, -v),
    )
}
test("Testing the Linear Integration Test", test_oscillation)
