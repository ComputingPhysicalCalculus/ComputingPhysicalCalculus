/**
 * @file Shaft.test.ts
 * @description This file contains the tests for the Shaft class.
 * @author Simon Solca
*/


import { Shaft } from '@src/core/Shaft';
import { MockDevice } from './MockDevice'
import { assert, test, describe, expect, it } from 'vitest'

/*
    TODO: Refactor to a fucntion so able to iterate
*/

describe("Shaft Class Testing", () =>{
    // create devices that the shaft should have as outputs
    let output_device_1 = new MockDevice();
    let output_device_2 = new MockDevice();
    let shaft = new Shaft(1, [output_device_1, output_device_2]);

    // test constructor
    test("Checking initial values", () => {
        expect(shaft.currentRotation).toBe(0)
        expect(shaft.nextRotation).toBe(0)
        expect(shaft.resultReady).toBe(false)
        expect(shaft.outputs).toEqual([output_device_1, output_device_2])
    });

    // check update function works
    test("Checking update function", () => {
        let next_rotation_value = 0.75;
        shaft.nextRotation = next_rotation_value;
        shaft.resultReady = true
        shaft.update();
        expect(shaft.currentRotation).toBe(next_rotation_value);
        expect(shaft.resultReady).toBe(false);
    });
})