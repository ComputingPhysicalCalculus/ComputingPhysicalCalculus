/**
 * @file GearPair.ts
 * @description This file contains the definition of the GearPair class.
 * @author Hanzhang Shen
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class GearPair
 * @description the GearPair class which simulates the gear pair connecting two horizontal shafts.
 * @implements Device
 */
export class GearPair implements Device {
    private shafts: Shaft[];
    private input: Shaft | undefined;
    private output: Shaft | undefined;
    private factor: number;

    /**
     * @constructor
     * @description The constructor of the GearPair class.
     * @param shaft1 The shaft that represents one of the connected shaft
     * @param shaft2 The shaft that represents one of the connected shaft
     * @param factor The gear ratio. A ratio of k means that shaft 2 rotates k turns when shaft 1 rotates 1 turn. It can be negative.
     */
    constructor(shaft1: Shaft, shaft2: Shaft, factor: number) {
        this.shafts = [shaft1, shaft2];
        this.factor = factor
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the gear pair given the input
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
            this.factor = 1.0 / this.factor;
        }
        return this.output;
    }
    update(dt: number = 1): void {
        const rotation_rate = this.factor * this.input?.get_rotation_rate()!;
        this.output?.set_rotation_rate(rotation_rate);
    }
}
