/**
 * @file FunctionTable.ts
 * @description This file contains the definition of the FunctionTable class.
 * @author Andy Zhu
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class FunctionTable
 * @description the FunctionTable class which simulates the FunctionTable in differential analyzer
 * @implements Device
 */
export class FunctionTable implements Device {
    private output: Shaft;
    private x_position: number;
    private fun: (n: number) => number;
    private input: Shaft;

    /**
     * @constructor
     * @description The constructor of the FunctionTable class.
     * @param input The shaft which sends input to FunctionTable
     * @param output The shaft which the output goes to
     * @param initial_x_position The initial_x_position user sets 
     * @param fun The function of to trace
     */
    constructor(input: Shaft, output: Shaft, initial_x_position: number, fun: (n: number) => number) {
        this.input = input;
        this.output = output;
        this.fun = fun;
        this.x_position = initial_x_position;
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the FunctionTable
     */
    getOutput(): Shaft | undefined {
        if(!this.output.resultReady) {
            this.x_position += this.input.nextRotation;
            this.output.resultReady = true;
            this.output.nextRotation = this.fun(this.x_position);
        }
        return this.output;
    }
}