/**
 * @file OutputTable.test.ts
 * @description This file contains the tests for the OutputTable device.
 * @author Simon Solca
*/

import { OutputTable } from "@src/core/OutputTable";
import { MockShaft } from "./MockShaft";
import { test, expect } from 'vitest'

/*
    taken from:
    https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

    Test with random values but have the values be the same 
    each run
*/
var seed = 1;
function output_table_test_random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


/**
 * @function test_initial_motor_values
 * @description Tests the internal state of a motor against
 * expected values
*/
function test_initial_OutputTable_values(output_table: OutputTable,
                                         x: MockShaft,
                                         y1: MockShaft,
                                         initialY1: number, 
                                         y2?: MockShaft, 
                                         initialY2?: number){
    // testing constructor
    expect((output_table as any).x).toBe(x);
    expect((output_table as any).y1).toBe(y1);
    expect((output_table as any).xHistory).toEqual([x.currentRotation]);
    expect((output_table as any).y1History).toEqual([initialY1]);
    if(y2 != undefined && initialY2 != undefined) {
        expect((output_table as any).y2).toBe(y2);
        expect((output_table as any).y2History).toEqual([initialY2]);
    }
    else{
        expect((output_table as any).y2).toBe(undefined);
        expect((output_table as any).y2History).toBe(undefined);
    }
}



function test_add_plot_once(x_rot: number, y1_rot: number, initial_y1: number, y2_rot?: number, initial_y2?: number){
    let x = new MockShaft(3);
    let y1 = new MockShaft(2);
    x.currentRotation = x_rot;
    y1.currentRotation = y1_rot;
    let y2 = undefined;
    if (y2_rot != undefined && initial_y2 != undefined){
        y2 = new MockShaft(5);
        y2.currentRotation = y2_rot;
    }

    let output_table = new OutputTable(x, y1, initial_y1, y2, initial_y2);

    test_initial_OutputTable_values(output_table, x, y1, initial_y1, y2, initial_y2);

    output_table.addPlot();
    let x_hist = (output_table as any).xHistory;
    let y1_hist = (output_table as any).y1History;
    let y2_hist = (output_table as any).y2History;
    expect(x_hist[x_hist.length - 1]).toBeCloseTo(x_rot + x_rot);
    expect(y1_hist[y1_hist.length - 1]).toBeCloseTo(y1_rot + initial_y1);
    if (y2_rot != undefined && y2_hist != undefined){
        expect(y2_hist[y2_hist.length - 1]).toBeCloseTo(y2_rot + initial_y2);
    }
}

// fuzz test_changeRotation
// create array which contains the two rotation values
let test_data = Array.from({ length: 20 }, (_, i) => 
    [2 * (output_table_test_random() - 0.5),
     2 * (output_table_test_random() - 0.5),
     2 * (output_table_test_random() - 0.5),
     2 * (output_table_test_random() - 0.5),
     2 * (output_table_test_random() - 0.5)]);

test.each(test_data)('Test: OutputTable addPlot', (x_rot, y_rot, init_y1, y2_rot, init_y2) => {
    test_add_plot_once(x_rot, y_rot, init_y1, y2_rot, init_y2);
});