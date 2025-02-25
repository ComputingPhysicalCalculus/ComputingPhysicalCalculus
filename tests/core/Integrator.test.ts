/**
 * @file Integrator.test.ts
 * @description This file contains the tests for the Integrator device.
 * @author Simon Solca
*/

import { Integrator } from "@src/core/Integrator";
import { MockShaft } from "./MockShaft";
import { test, describe, expect } from 'vitest'

/*
    taken from:
    https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    Test with random values but have the values be the same 
    each run
*/
var seed = 1;
function integrator_test_random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


/**
 * @function test_initial_multiplier_values
 * @description Tests the internal state of a Multiplier against
 * expected values
*/
function test_initial_integrator_values(integrator : Integrator,
                             wrt: MockShaft, 
                             integrand: MockShaft, 
                             output: MockShaft){
    // testing constructor
    test("Checking initial values", () => {
        expect((integrator as any).output).toBe(output);
        expect((integrator as any).variableOfIntegration).toBe(wrt);
        expect((integrator as any).integrand).toBe(integrand);
    });
}


describe("Testing Integrator", () =>{
    // create mock shafts 
    let mock_integrand = new MockShaft(1);
    let mock_wrt = new MockShaft(2)
    let mock_output = new MockShaft(3);
    // create instance of FunctionTable
    let integrator = new Integrator(0, mock_wrt, mock_integrand, mock_output, false, 1, 2);

    test_initial_integrator_values(integrator, mock_wrt, mock_integrand, mock_output);
});