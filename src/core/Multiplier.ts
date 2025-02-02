/**
 * @file Multiplier.ts
 * @description This file contains the definition of the Multiplier class.
 * @author Andy Zhu
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Multiplier
 * @description the Multiplier class which simulates the Multiplier in differential analyzer
 * @implements Device
 */
export class Multiplier implements Device {
    private output: Shaft;
    private factor: number;
    private input: Shaft;


    /**
     * @constructor
     * @description The constructor of the Multiplier class.
     * @param input The shaft which sends input to Multiplier
     * @param output The shaft which the output goes to
     * @param factor The factor of multiplication
     */
    constructor(input: Shaft, output: Shaft, factor: number) {
        this.factor = factor
        this.input = input;
        this.output = output;
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Multiplier
     */
    getOutput(): Shaft | undefined {
        if(this.output.resultReady) {
            return this.output;
        } else if(!this.input.resultReady) {
            return undefined;
        } else {
            this.output.nextRotation = this.input.nextRotation * this.factor;
            this.output.resultReady = true;
        }
        return this.output;
    }
}