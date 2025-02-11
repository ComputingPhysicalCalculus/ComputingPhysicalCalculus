/**
 * @file Gear.ts
 * @description This file contains the definition of the Gear class.
 * @author Andy Zhu
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Gear
 * @description the Gear class which simulates the Gear connecting a vertical and a horizontal shaft
 * @implements Device
 */
export class Gear implements Device {
    private shafts: Shaft[];

    /**
     * @constructor
     * @description The constructor of the Gear class.
     * @param shaft1 The shaft that represents one of the connected shaft
     * @param shaft2 The shaft that represents one of the connected shaft
     */
    constructor(shaft1: Shaft, shaft2: Shaft) {
        this.shafts = [shaft1, shaft2];
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Gear given the input
     */
    getOutput(): Shaft | undefined {
        if(!this.shafts[0].resultReady && !this.shafts[1].resultReady) {
            return undefined;
        }
        if(this.shafts[0].resultReady) {
            this.shafts[1].nextRotation = this.shafts[0].nextRotation;
            this.shafts[1].resultReady = true;
            return this.shafts[1];
        }
        if(this.shafts[1].resultReady) {
            this.shafts[0].nextRotation = this.shafts[1].nextRotation;
            this.shafts[0].resultReady = true;
            return this.shafts[0];
        }
    }
}