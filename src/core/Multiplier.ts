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
    private multiplicand_shaft?: Shaft;
    private input: Shaft;
    private previous_value: number;
    id: number;


    /**
     * @constructor
     * @description The constructor of the Multiplier class.
     * @param input The shaft which sends input to Multiplier
     * @param output The shaft which the output goes to
     * @param factor The factor of multiplication
     */
    constructor(id: number, input: Shaft, output: Shaft, factor: number, multiplicand_shaft: Shaft | undefined = undefined) {
        this.id = id;
        this.factor = factor
        this.input = input;
        this.output = output;
        this.multiplicand_shaft = multiplicand_shaft;
        this.previous_value = this.factor;
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
        if (!this.multiplicand_shaft) {
            this.output.set_rotation_rate(this.input.get_rotation_rate() * this.factor);
        } else {
            this.output.set_rotation_rate(this.input.rotation * this.multiplicand_shaft.get_rotation_rate() + this.multiplicand_shaft.rotation * this.input.get_rotation_rate());
        }

    }

    getID(): number { return this.id; }
}
