/**
 * @file IntegrationTest.test.ts
 * @description This file contains Integration Test using example provided in the slides
 * The exact equation it describes is x'' + 3x' + 2x = 0
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

describe("Differential Class Testing 1", () =>{
    // create mock shafts 
    let t_shaft = new Shaft(1, []); // t
    let x_shaft = new Shaft(2, []); // x
    let dx_shaft = new Shaft(3, []); // dx/dt
    let three_dx_shaft = new Shaft(4, []); // 3dx/dt
    let minus_two_x_shaft = new Shaft(5, []); // -2x
    let to_int_shaft = new Shaft(6, []); // 3dx - 2x

    let dx_0 = 1;
    let ddx_0 = 1;
    let x_0 = 0.5 * (3*dx_0 - ddx_0);

    // create instance of Devices
    let differential = new Differential(three_dx_shaft, minus_two_x_shaft, to_int_shaft);
    let integrator1 = new Integrator(t_shaft, to_int_shaft, dx_shaft, false, dx_0);
    let integrator2 = new Integrator(t_shaft, dx_shaft, x_shaft, false, x_0);
    let multiplier1 = new Multiplier(x_shaft, minus_two_x_shaft, -2);
    let multiplier2 = new Multiplier(three_dx_shaft, dx_shaft, 3);
    let outputTable = new OutputTable(t_shaft, x_shaft, x_0, dx_shaft, dx_0);

    const MAX_VALUE_POWER = 2;

    // number of cycles
    let N = 100;
    let rotation_rate = MAX_VALUE_POWER / N;

    let motor = new Motor(rotation_rate, t_shaft);

    // setting outputs to each shaft
    t_shaft.outputs = [integrator1, integrator2, outputTable];
    x_shaft.outputs = [multiplier1, outputTable];
    dx_shaft.outputs = [integrator2, multiplier2, outputTable];
    three_dx_shaft.outputs = [differential];
    minus_two_x_shaft.outputs = [differential];
    to_int_shaft.outputs = [integrator1];

    // create instance of array to test 

    let mock_shafts = [t_shaft, x_shaft, dx_shaft, three_dx_shaft, minus_two_x_shaft, to_int_shaft];
    let devices = [differential, integrator1, integrator2, multiplier1, multiplier2, outputTable];
    let simulator = new Simulator(mock_shafts, motor, [outputTable], devices);


    for(let i = 0; i < N; i++) {
        simulator.step();
    }    

    let MSE = 0;

    let xhist = simulator.outputTables[0].xHistory;
    let yhist = simulator.outputTables[0].y1History;
    for (let i = 0; i < xhist.length; i++){
        let d = Math.exp(xhist[i]) - yhist[i];
        MSE += d*d;
    }

    MSE = MSE / N;
    
    console.log(MSE);
    test("MSE value", () =>{
        expect(MSE).toBeLessThan(0.1);
        console.log(MSE);
    });
});