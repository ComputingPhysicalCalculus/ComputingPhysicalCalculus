/**
 * @file IntegrationTest.test.ts
 * @description This file contains Integration Test using example provided in the slides
 * The exact equation it describes is x'' - 3x' + 2x = 0
 * @author Andy Zhu
*/


import { Differential } from "../../src/core/Differential";
import { Integrator } from "../../src/core/Integrator";
import { Multiplier } from "../../src/core/Multiplier";
import { FunctionTable } from "../../src/core/FunctionTable";
import { OutputTable } from "../../src/core/OutputTable";
import { Motor } from "../../src/core/Motor";
import { Simulator } from "../../src/core/Main";
import { Shaft } from "../../src/core/Shaft";
import { assert, test, describe, expect, it } from 'vitest'
import { PPMC, binary_search} from "./TestingUtil.ts";
import fs from 'fs';


/**
 * @function test_diff_eq
 * @description tests the differential equation x'' - 3x' + 2x = 0; dx_0 = x'(0), ddx_0 = x''(0)
 * @return x value
 * @author Andy Zhu, Simon Solca
*/
function test_diff_eq(dx_0: number, ddx_0: number){
    // number of cycles
    const N = 1000;
    const c = 1;
    // test statistic
    const PPMC_THRESHOLD = 0.95;
    const MAX_DIFF = 10;

    // create mock shafts 
    let t_shaft = new Shaft(1, []); // t
    let x_shaft = new Shaft(2, []); // x
    let dx_shaft = new Shaft(3, []); // dx/dt
    let three_dx_shaft = new Shaft(4, []); // 3dx/dt
    let minus_two_x_shaft = new Shaft(5, []); // -2x
    let to_int_shaft = new Shaft(6, []); // 3dx - 2x


    // calculate initial value by rearranging
    let x_0 = 0.5 * (3*dx_0 - ddx_0);

    // in form x = Ae^2t + Be^t
    let A = 0.5 * (ddx_0 - dx_0);
    let B = dx_0 - 2 * A;


    // determine the rotation rate so that the function doesnt get too big
    // and the system diverges
    let F = (v : number) => A * Math.exp(2 * v) + B * Math.exp(v);

    
    let rotation_rate = 2/N;

    // create instance of Devices
    let differential = new Differential(three_dx_shaft, minus_two_x_shaft, to_int_shaft);
    let integrator1 = new Integrator(t_shaft, to_int_shaft, dx_shaft, false, 3 * dx_0 - 2 * x_0);
    let integrator2 = new Integrator(t_shaft, dx_shaft, x_shaft, false, dx_0);
    let multiplier1 = new Multiplier(x_shaft, minus_two_x_shaft, -2);
    let multiplier2 = new Multiplier(dx_shaft,three_dx_shaft, 3);
    let outputTable = new OutputTable(t_shaft, x_shaft, x_0, dx_shaft, dx_0);

    let motor = new Motor(rotation_rate, t_shaft);

    // setting outputs to each shaft
    t_shaft.outputs = [integrator1, integrator2, outputTable];
    x_shaft.outputs = [multiplier1, outputTable];
    dx_shaft.outputs = [multiplier2, integrator2, outputTable];
    three_dx_shaft.outputs = [differential];
    minus_two_x_shaft.outputs = [differential];
    to_int_shaft.outputs = [integrator1];

    // create instance of array to test 
    let mock_shafts = [t_shaft, x_shaft, dx_shaft, three_dx_shaft, minus_two_x_shaft, to_int_shaft];
    let devices = [differential, integrator1, multiplier1, multiplier2, outputTable];
    let simulator = new Simulator();
    simulator.shafts = mock_shafts;
    simulator.motor = motor;
    simulator.outputTables = [outputTable];
    simulator.components = devices;

    simulator.setup();

    for(let i = 0; i < N; i++) {
        simulator.step();
    }    


    let t = simulator.outputTables[0].xHistory;
    let x = simulator.outputTables[0].y1History!;

    let true_values = Array.from({length: N+1}, (_, i) => F(t[i]));
    let r = PPMC(x, true_values);
    
    expect(r).toBeGreaterThan(PPMC_THRESHOLD);
};


let test_data: [number, number][] = [];


// avoid gradient being too little compared to second derivative
// so function doesn't explode
for (let a = 1; a < 20; a++){
    for (let b = 1; b < 20; b++){
        test_data.push([a,b]);
    }
}

test.each(test_data)(`Test: x\'\' - 3x\' + 2x = 0`, (dx_0, ddx_0) => {
    test_diff_eq(dx_0, ddx_0);
});