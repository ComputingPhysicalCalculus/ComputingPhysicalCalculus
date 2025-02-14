/**
 * @file FunctionTable.ts
 * @description This file contains the definition of the FunctionTable class.
 * @author Simon Solca, Andy Zhu
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class FunctionTable
 * @description the FunctionTable class which simulates the FunctionTable in differential analyzer
 * @implements Device
 */
export class FunctionTable implements Device {
    id: number = 0;
    private output: Shaft;
    x_position: number;
    private f_n: number;
    fun: (n: number) => number;
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
        this.f_n = fun(initial_x_position);
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the FunctionTable
     */
    determine_output(): Shaft | undefined {
        return this.output;
    }


    /**
     * @method update
     * @description This method directly updates the rotation rate of its output
     * as the change in the functions value
    */
    update(){
        // calculate new x position and new f(x) position
        this.x_position += this.input.get_rotation_rate();
        let f_np1 = this.fun(this.x_position);

        // set the rotation of the output to be Delta f(x)
        this.output.set_rotation_rate(f_np1 - this.f_n);
        // update the current f(x) value
        this.f_n = f_np1;
    }
}
