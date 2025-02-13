/**
 * @file Shaft.ts
 * @description This file contains the definition of the Shaft class.
 * @author Simon Solca, Andy Zhu
 */

import { Device } from "./Device";

/**
 * @class Shaft
 * @description the Shaft class which simulates the Shafts in differential analyzer
 */
export class Shaft {
    private rotation_rate: number;
    rotation: number;
    outputs: Device[];
    id: number;
    // used in the setup of the sim only
    ready_flag: boolean = false;

    /**
     * @constructor
     * @description The constructor of the Shaft class.
     * @param outputs An array of Devices the shaft output to
     */
    constructor(id: number, outputs: Device[]) {
        this.rotation_rate = 0;
        this.rotation = 0;
        this.outputs = outputs;
        this.id = id;
    }

    /**
     * @method update
     * @description adds the rotation rate to the current rotation
    */
    update(): void {
        this.rotation += this.rotation_rate;
    }


    
    set_rotation_rate(rate: number): void{
        this.rotation_rate = rate;
    }

    get_rotation_rate(): number{
        return this.rotation_rate;
    }
}