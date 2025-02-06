/**
 * @file Differential.test.ts
 * @description This file contains the tests for the Differential device.
 * @author Simon Solca
*/


import { Differential } from "@src/core/Differential";
import { MockShaft } from "./MockShaft";
import { assert, test, describe, expect, it } from 'vitest'


/*
    All Tests in this file follow same pattern
    But with different starting values.

    TODO: Refactor into a specific funtion so can be iterated on
*/

describe("Differential Class Testing 1", () =>{
    // create mock shafts 
    let mock_shaft_1 = new MockShaft(1);
    let mock_shaft_2 = new MockShaft(2);
    let mock_shaft_3 = new MockShaft(3);
    // create instance of Differential
    let differential = new Differential(mock_shaft_1, mock_shaft_3, mock_shaft_2);
    // create instance of array to test against internal Differential state
    let mock_shaft_arr = [mock_shaft_1, mock_shaft_2, mock_shaft_3];

    // testing constructor
    test("Checking initial values", () => {
        expect((differential as any).output).toBe(undefined)
        expect((differential as any).shafts).toEqual(mock_shaft_arr);
    });

    test("Checking getOutput function with, shaft 1 and 2 being ready and adding", () => {
        let shaft_1_rotation = 0.22;
        let shaft_2_rotation = 0.57;
        mock_shaft_1.resultReady = true;
        mock_shaft_2.resultReady = true;
        mock_shaft_3.resultReady = false
        mock_shaft_1.nextRotation = shaft_1_rotation;
        mock_shaft_2.nextRotation = shaft_2_rotation;

        // want the return to be 3rd shaft, and to be internally updated
        expect(differential.getOutput()).toBe(mock_shaft_3);
        expect((differential as any).output).toBe(mock_shaft_3);
        // want the 3rd shaft to be ready
        expect(mock_shaft_3.resultReady).toBe(true);
        // want the next rotation to be equal to the addition
        // (floating point numbers so .toBeCloseTo is called for inprecision)
        expect(mock_shaft_3.nextRotation).toBeCloseTo(shaft_2_rotation - shaft_1_rotation);
    });
});

describe("Differential Class Testing 2", () =>{
    let mock_shaft_1 = new MockShaft(5);
    let mock_shaft_2 = new MockShaft(2);
    let mock_shaft_3 = new MockShaft(2);
    let differential = new Differential(mock_shaft_1, mock_shaft_3, mock_shaft_2);
    let mock_shaft_arr = [mock_shaft_1, mock_shaft_2, mock_shaft_3];

    test("Checking initial values", () => {
        expect((differential as any).output).toBe(undefined)
        expect((differential as any).shafts).toEqual(mock_shaft_arr);
    });

    test("Checking getOutput function with, shaft 1 and 3 being ready and adding", () => {
        let shaft_1_rotation = 0.93;
        let shaft_3_rotation = 0.13;
        mock_shaft_1.resultReady = true;
        mock_shaft_3.resultReady = true;
        mock_shaft_2.resultReady = false
        mock_shaft_1.nextRotation = shaft_1_rotation;
        mock_shaft_3.nextRotation = shaft_3_rotation;
        expect(differential.getOutput()).toMatchObject(mock_shaft_2);
        expect((differential as any).output).toBe(mock_shaft_2);
        expect(mock_shaft_2.resultReady).toBe(true);
        expect(mock_shaft_2.nextRotation).toBeCloseTo(shaft_1_rotation + shaft_3_rotation);
    })
});

describe("Differential Class Testing 3", () =>{
    let mock_shaft_1 = new MockShaft(3);
    let mock_shaft_2 = new MockShaft(9);
    let mock_shaft_3 = new MockShaft(4);
    let differential = new Differential(mock_shaft_1, mock_shaft_3, mock_shaft_2);
    let mock_shaft_arr = [mock_shaft_1, mock_shaft_2, mock_shaft_3];

    test("Checking initial values", () => {
        expect((differential as any).output).toBe(undefined)
        expect((differential as any).shafts).toEqual(mock_shaft_arr);
    });

    test("Checking getOutput function with, shaft 2 and 3 being ready and adding", () => {
        let shaft_2_rotation = 0.52;
        let shaft_3_rotation = 0.17;
        mock_shaft_2.resultReady = true;
        mock_shaft_3.resultReady = true;
        mock_shaft_1.resultReady = false
        mock_shaft_2.nextRotation = shaft_2_rotation;
        mock_shaft_3.nextRotation = shaft_3_rotation;

        expect(differential.getOutput()).toMatchObject(mock_shaft_1);
        expect((differential as any).output).toBe(mock_shaft_1);
        expect(mock_shaft_1.resultReady).toBe(true);
        expect(mock_shaft_1.nextRotation).toBeCloseTo(shaft_2_rotation - shaft_3_rotation);
    })
});
