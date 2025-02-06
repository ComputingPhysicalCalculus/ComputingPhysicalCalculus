/**
 * @file FunctionTable.test.ts
 * @description This file contains the tests for the FunctionTable device.
 * @author Simon Solca
*/

import { FunctionTable } from "@src/core/FunctionTable";
import { MockShaft } from "./MockShaft";
import { test, describe, expect } from 'vitest'

/*
    taken from:
    https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    Test with random values but have the values be the same 
    each run
*/
var seed = 1;
function functionTable_test_random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

let epsilon = 0.00005;

function test_functions(f: (n: number) => number, g: (n: number) => number): boolean{
    for (let i= 0; i < 50; i++){
        let x = functionTable_test_random() * 25;
        if (Math.abs(f(x) - g(x)) >= epsilon){
            return false;
        }
    }
    return true;
}


/**
 * @function test_initial_multiplier_values
 * @description Tests the internal state of a Multiplier against
 * expected values
*/
function test_initial_functionTable_values(functionTable : FunctionTable,
                             input: MockShaft, 
                             output: MockShaft, 
                             initial_x_position: number,
                             fun: (n: number) => number){
    // testing constructor
    test("Checking initial values", () => {
        expect((functionTable as any).input).toBe(input);
        expect((functionTable as any).output).toBe(output);
        expect((functionTable as any).x_position).toBeCloseTo(initial_x_position);
        let funcs_equal = test_functions((functionTable as any).fun, fun);
        expect(funcs_equal).toBe(true);
    });
}


describe("Testing FunctionTable", () =>{
    // create mock shafts 
    let mock_input = new MockShaft(1);
    let mock_output = new MockShaft(2);
    let initial_x = 10;
    function fun(n : number){return n + 5};
    // create instance of FunctionTable
    let ft = new FunctionTable(mock_input, mock_output, initial_x, fun);

    test_initial_functionTable_values(ft, mock_input, mock_output, initial_x, fun);
});