/**
 * @file Multiplier.test.ts
 * @description This file contains the tests for the Multiplier device.
 * @author Simon Solca
*/

import { Multiplier } from "@src/core/Multiplier";
import { MockShaft } from "./MockShaft";
import { test, expect } from 'vitest'


/*
    taken from:
    https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    Test with random values but have the values be the same 
    each run
*/
var seed = 1;
function multiplier_test_random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


/**
 * @function test_initial_multiplier_values
 * @description Tests the internal state of a Multiplier against
 * expected values
*/
function test_initial_multiplier_values(multiplier : Multiplier,
                             mock_shaft_input : MockShaft,
                             mock_shaft_output : MockShaft, 
                             factor: number){
    // testing constructor
    test("Checking initial values", () => {
        expect((multiplier as any).input).toBe(mock_shaft_input);
        expect((multiplier as any).output).toBe(mock_shaft_output);
        expect((multiplier as any).factor).toBeCloseTo(factor);
    });
}


/**
 * @function multiplier_test_output_not_ready_input_ready
 * @description Tests with output shaft resultReady = false, and input shaft resultReady = true
*/
function multiplier_test_output_not_ready_input_ready(
        getOutput_test_string: string, factor: number, rotation_in: number) : void
    {
    // create mock shafts 
    let mock_shaft_input = new MockShaft(1);
    let mock_shaft_output = new MockShaft(2);
    // create instance of Multiplier to test
    let multiplier = new Multiplier(mock_shaft_input, mock_shaft_output, factor);

    // testing constructor
    test_initial_multiplier_values(multiplier, mock_shaft_input, mock_shaft_output, factor);

    test(getOutput_test_string, () => {
        mock_shaft_input.resultReady = true;
        mock_shaft_output.resultReady = false;
        mock_shaft_input.nextRotation = rotation_in;

        // want the return to be output shaft, and ready
        expect(multiplier.getOutput()).toBe(mock_shaft_output);
        expect(mock_shaft_output.resultReady).toBe(true);
        // want the next rotation to be equal to the multiplication
        // (floating point numbers so .toBeCloseTo is called for inprecision)
        expect(mock_shaft_output.nextRotation).toBeCloseTo(factor * rotation_in);
    });
};

// Fuzz multiplier_test_output_not_ready_input_ready
for (let i = 0; i < 20; i++){
    // let the factors be from -1 to 1
    let factor = 2*(multiplier_test_random() - 0.5);
    let rotation_in = 2*(multiplier_test_random() - 0.5);
    let test_string = "Testing the getOutput() with output not ready and input ready, with rotation "
        + rotation_in.toFixed(4) + " and factor " + factor.toFixed(4);
    multiplier_test_output_not_ready_input_ready(test_string, factor, rotation_in);
};



/**
 * @function multiplier_test_output_ready
 * @description Tests with output shaft resultReady = true
*/
function multiplier_test_output_ready(
    getOutput_test_string: string, factor: number, rotation: number) : void
    {
    // create mock shafts 
    let mock_shaft_input = new MockShaft(1);
    let mock_shaft_output = new MockShaft(2);
    // create instance of Multiplier to test
    let multiplier = new Multiplier(mock_shaft_input, mock_shaft_output, factor);

    // testing constructor
    test_initial_multiplier_values(multiplier, mock_shaft_input, mock_shaft_output, factor);

    test(getOutput_test_string, () => {
        mock_shaft_output.nextRotation = rotation;
        mock_shaft_output.resultReady = true;

        // want the return to be output shaft, and ready
        expect(multiplier.getOutput()).toBe(mock_shaft_output);
        expect(mock_shaft_output.resultReady).toBe(true);
        // want the next rotation to be equal to the value that it had before call
        // (floating point numbers so .toBeCloseTo is called for inprecision)
        expect(mock_shaft_output.nextRotation).toBeCloseTo(rotation);
    });
};

// Fuzz multiplier_test_output_ready
for (let i = 0; i < 5; i++){
    // let the factors be from -1 to 1
    let factor = 2*(multiplier_test_random() - 0.5);
    let rotation_in = 2*(multiplier_test_random() - 0.5);
    let test_string = "Testing the getOutput() with output ready";
    multiplier_test_output_ready(test_string, factor, rotation_in);
};


/**
 * @function multiplier_test_input_not_ready
 * @description Tests with output shaft resultReady = false, and input shaft resultReady = false
*/
function multiplier_test_input_not_ready(
    getOutput_test_string: string, factor: number, rotation: number) : void
    {
    // create mock shafts 
    let mock_shaft_input = new MockShaft(1);
    let mock_shaft_output = new MockShaft(2);
    // create instance of Multiplier to test
    let multiplier = new Multiplier(mock_shaft_input, mock_shaft_output, factor);

    // testing constructor
    test_initial_multiplier_values(multiplier, mock_shaft_input, mock_shaft_output, factor);

    test(getOutput_test_string, () => {
        mock_shaft_output.nextRotation = rotation;
        mock_shaft_input.resultReady = false;

        // want the return to be undefined
        expect(multiplier.getOutput()).toBe(undefined);

        // TODO: figure out whether we should set output ready to false?
        //expect(mock_shaft_output.resultReady).toBe(true);

        // want the next rotation of output to be equal to the value that it had before call
        // (floating point numbers so .toBeCloseTo is called for inprecision)
        expect(mock_shaft_output.nextRotation).toBeCloseTo(rotation);
    });
};

// Fuzz multiplier_test_input_not_ready
for (let i = 0; i < 5; i++){
    // let the factors be from -1 to 1
    let factor = 2*(multiplier_test_random() - 0.5);
    let rotation_in = 2*(multiplier_test_random() - 0.5);
    let test_string = "Testing the getOutput() with input not ready";
    multiplier_test_input_not_ready(test_string, factor, rotation_in);
};