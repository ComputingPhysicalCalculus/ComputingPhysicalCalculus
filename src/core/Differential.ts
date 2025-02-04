/**
 * @file Differential.ts
 * @description This file contains the definition of the Differential class.
 * @author Andy Zhu
 */


import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Differential
 * @description the Differential class which simulates the differential in differential analyzer
 * @implements Device
 */
export class Differential implements Device {
    private output: Shaft | undefined;
    // the sum shaft is always in the middle
    private shafts: Shaft[];

    /**
     * @constructor
     * @description The constructor of the Differential class.
     * @param diffShaft1 The shaft that represents one of the connected shaft
     * @param diffShaft2 The shaft that represents one of the connected shaft
     * @param sumShaft The shaft that represents the sum of the two diffShafts (not necessarily the output)
     */
    constructor(diffShaft1: Shaft, diffShaft2: Shaft, sumShaft: Shaft) {
        this.shafts = [diffShaft1, sumShaft, diffShaft2];
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Differential
     */
    getOutput() : Shaft | undefined {
        let count: number = 0
        for(let shaft of this.shafts) {
            if(shaft.resultReady) {
                count += 1;
            }
        }
        if(count == 2) {
            let idx: number = 0;
            for(let i = 0;i<3;++i) {
                if(!this.shafts[i].resultReady) {
                    idx = i;
                }
            }
            if(idx == 0) {
                this.shafts[0].resultReady = true;
                this.shafts[0].nextRotation = this.shafts[1].nextRotation - this.shafts[2].nextRotation;
            } else if(idx == 1) {
                this.shafts[1].resultReady = true;
                this.shafts[1].nextRotation = this.shafts[0].nextRotation + this.shafts[2].nextRotation;
            } else {
                this.shafts[2].resultReady = true;
                this.shafts[2].nextRotation = this.shafts[1].nextRotation - this.shafts[0].nextRotation;
            }
            this.output = this.shafts[idx];
        } 
        return this.output;
    }
}