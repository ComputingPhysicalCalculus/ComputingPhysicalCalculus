/**
 * @file Motor.test.ts
 * @description This file contains the tests for the Motor device.
 * @author Simon Solca
*/

import { Motor } from "@src/core/Motor";
import { MockShaft } from "./MockShaft";
import { test, expect } from 'vitest'

/*
    taken from:
    https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    Test with random values but have the values be the same 
    each run
*/
var seed = 1;
function motor_test_random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


/**
 * @function test_initial_motor_values
 * @description Tests the internal state of a motor against
 * expected values
*/
function test_initial_motor_values(motor: Motor,
                                   rot: number,
                                   output: MockShaft){
    // testing constructor
    expect((motor as any).rotation).toBeCloseTo(rot);
    expect((motor as any).output).toBe(output);
}

function test_changeRotation(initial_rotation: number, new_rotation: number){
    // create mock shafts 
    let mock_output = new MockShaft(3);
    // create instance of FunctionTable
    let motor = new Motor(0, initial_rotation, mock_output);

    test_initial_motor_values(motor, initial_rotation, mock_output);

    motor.changeRotation(new_rotation);
    expect((motor as any).rotation).toBe(new_rotation);
}

// fuzz test_changeRotation
// create array which contains the two rotation values
test.each(Array.from({ length: 20 }, (_, i) => [2 * (motor_test_random() - 0.5), 2 * (motor_test_random() - 0.5)]))
  ('Test: Motor changeRotation', (initial_rotation, new_rotation) => {
    test_changeRotation(initial_rotation, new_rotation);
});


function test_getOutput(initial_rotation: number, new_rotation: number){
    // create mock shafts 
    let mock_output = new MockShaft(3);
    // create instance of FunctionTable
    let motor = new Motor(0, new_rotation, mock_output);

    test_initial_motor_values(motor, new_rotation, mock_output);

    // TODO: do more test based on result of the TODO: 5

    expect(motor.determine_output()).toBe(mock_output);
    motor.update();
    expect(mock_output.get_rotation_rate()).toBe(new_rotation);
}

// fuzz test_changeRotation
// create array which contains the two rotation values
test.each(Array.from({ length: 20 }, (_, i) => [2 * (motor_test_random() - 0.5), 2 * (motor_test_random() - 0.5)]))
  ('Test: Motor getOutput', (initial_rotation, new_rotation) => {
    test_getOutput(initial_rotation, new_rotation);
});