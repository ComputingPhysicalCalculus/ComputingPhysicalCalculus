/**
 * @file Differential.ts
 * @description This file contains the definition of the Differential class.
 * @author Simon Solca, Andy Zhu
 */


import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Differential
 * @description the Differential class which simulates the differential in differential analyzer
 * @implements Device
 */
export class Differential implements Device {
    id: number;
    private output: Shaft | undefined;
    // the sum shaft is always in the middle
    private shafts: Shaft[];
    private output_index: number = -1;

    /**
     * @constructor
     * @description The constructor of the Differential class.
     * @param diffShaft1 The shaft that represents one of the connected shaft
     * @param diffShaft2 The shaft that represents one of the connected shaft
     * @param sumShaft The shaft that represents the sum of the two diffShafts (not necessarily the output)
     */
    constructor(id: number, diffShaft1: Shaft, diffShaft2: Shaft, sumShaft: Shaft) {
        this.id = id;
        this.shafts = [diffShaft1, sumShaft, diffShaft2];
    }

    /**
     * @method getOutput
     * @description This method calculates the nextRotation of output shaft
     * @returns The output shaft that represents the output of the Differential
     */
    determine_output() : Shaft | undefined {
        // determine how many shafts are ready
        let count = 0
        for(const shaft of this.shafts) {
            if(shaft.ready_flag) {
                count++;
            }
        }

        // if theres 2 ready we can determine the output shaft
        if(count == 2) {
            // find shaft that isnt ready
            for(let i = 0; i < 3; i++) {
                if(!this.shafts[i].ready_flag) {
                    this.output_index = i;
                    break;
                }
            }
            this.output = this.shafts[this.output_index];
            return this.output;
        }
        else if (count == 3){
            return this.output;
        }
        else{
            return undefined;
        }
    }

    /**
     * @method update
     * @description This method directly updates the rotation rate of its output 
     * to be the combination of inputs shafts depending on which shafts were ready
    */
    update(dt: number = 1){
        let new_rotation = NaN;

        // case where sum shaft is the output
        if(this.output_index == 1){
            new_rotation = this.shafts[0].get_rotation_rate() + this.shafts[2].get_rotation_rate();
        }
        // case when output shaft is one of the other two
        else{
            new_rotation = this.shafts[1].get_rotation_rate() - this.shafts[2-this.output_index].get_rotation_rate();
        }
        this.output?.set_rotation_rate(new_rotation);
    }
}