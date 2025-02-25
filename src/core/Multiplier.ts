/**
 * @file Multiplier.ts
 * @description This file contains the definition of the Multiplier class.
 * @author Simon Solca, Andy Zhu
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
    id: number;


    /**
     * @constructor
     * @description The constructor of the Multiplier class.
     * @param input The shaft which sends input to Multiplier
     * @param output The shaft which the output goes to
     * @param factor The factor of multiplication
     */
    constructor(id: number, input: Shaft, output: Shaft, factor: number) {
        this.id = id;
        this.factor = factor
        this.input = input;
        this.output = output;
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Multiplier
    */

    determine_output(): Shaft | undefined {
        return this.output;
    }

    /**
     * @method update
     * @description This method directly updates the rotation rate of its output
     * to be factor * (input's rotation rate)
    */
    update(dt: number = 1): void {
        this.output.set_rotation_rate(this.input.get_rotation_rate() * this.factor);
    }
}