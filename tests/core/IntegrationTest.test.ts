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
    let mock_shaft_1 = new Shaft(1, []); // t
    let mock_shaft_2 = new Shaft(2, []); // x
    let mock_shaft_3 = new Shaft(3, []); // dx/dt
    let mock_shaft_4 = new Shaft(4, []); // F(dx/dt)
    let mock_shaft_5 = new Shaft(5, []); // F(dx/dt) + k/m x
    let mock_shaft_6 = new Shaft(6, []); // k/m x

    // set constants
    let k = 2;
    let m = 1;
    let F = (x: number) => { return -3 * x; };

    // create instance of Devices
    let differential = new Differential(mock_shaft_4, mock_shaft_6, mock_shaft_5);
    let integrator1 = new Integrator(mock_shaft_1, mock_shaft_5, mock_shaft_3, true, 1);
    let integrator2 = new Integrator(mock_shaft_1, mock_shaft_3, mock_shaft_2, false, 1);
    let multiplier = new Multiplier(mock_shaft_2, mock_shaft_6, k / m);
    let functionTable = new FunctionTable(mock_shaft_3, mock_shaft_4, 0, F);
    let outputTable = new OutputTable(mock_shaft_1, mock_shaft_2, 0, mock_shaft_3, 0);
    let motor = new Motor(1, mock_shaft_1);

    // setting outputs to each shaft
    mock_shaft_1.outputs = [integrator1, integrator2, outputTable];
    mock_shaft_2.outputs = [multiplier, outputTable];
    mock_shaft_3.outputs = [functionTable, integrator2, outputTable];
    mock_shaft_4.outputs = [differential];
    mock_shaft_5.outputs = [differential, integrator1];
    mock_shaft_6.outputs = [differential];

    // create instance of array to test 

    let mock_shafts = [mock_shaft_1, mock_shaft_2, mock_shaft_3, mock_shaft_4, mock_shaft_5, mock_shaft_6];
    let devices = [differential, integrator1, integrator2, multiplier, functionTable, outputTable];
    let simulator = new Simulator(mock_shafts, motor, [outputTable], devices);


    for(let i = 1;i<=10;++i) {
        simulator.step();
        console.log(mock_shaft_3.currentRotation);
    }    

    test("", () => {
        console.log(simulator.outputTables[0].y1History);
        expect(false);
    });
});