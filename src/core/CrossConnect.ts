/**
 * @file CrossConnect.ts
 * @description This file contains the definition of the CrossConnect class.
 * @author Andy Zhu
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Cross Connect
 * @description the Cross connnect class which simulates the Cross connect connecting a vertical and a horizontal shaft
 * @implements Device
 */
export class CrossConnect implements Device {
    id: number;
    private shafts: Shaft[];
    private output: Shaft | undefined;
    private input: Shaft | undefined;
    private reversed: Boolean;

    /**
     * @constructor
     * @description The constructor of the Cross Connect class.
     * @param shaft1 The shaft that represents one of the connected shaft
     * @param shaft2 The shaft that represents one of the connected shaft
     * @param reversed A flag representing whether or not the output should be reversed
     */
    constructor(id: number, shaft1: Shaft, shaft2: Shaft, reversed: Boolean) {
        this.id = id;
        this.shafts = [shaft1, shaft2];
        this.reversed = reversed;
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Gear given the input
     */
    determine_output(): Shaft | undefined {
        if (!this.shafts[0].ready_flag && !this.shafts[1].ready_flag) {
            return undefined;
        }
        if (this.shafts[0].ready_flag && !this.shafts[1].ready_flag) {
            this.output = this.shafts[1];
            this.input = this.shafts[0];
        }
        if (this.shafts[1].ready_flag && !this.shafts[0].ready_flag) {
            this.output = this.shafts[0];
            this.input = this.shafts[1];
        }
        return this.output;
    }
    update(dt: number = 1): void {
        const rotation_rate = this.input?.get_rotation_rate()!;
        this.output?.set_rotation_rate(this.reversed ? -rotation_rate : rotation_rate);
    }
}
