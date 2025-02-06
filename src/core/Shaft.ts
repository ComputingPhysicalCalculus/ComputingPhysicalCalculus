/**
 * @file Shaft.ts
 * @description This file contains the definition of the Shaft class.
 * @author Andy Zhu
 */

import { Device } from "./Device";

/**
 * @class Shaft
 * @description the Shaft class which simulates the Shafts in differential analyzer
 */
export class Shaft {
    currentRotation: number;
    nextRotation: number;
    resultReady: boolean;
    outputs: Device[];
    id: number;

    /**
     * @constructor
     * @description The constructor of the Shaft class.
     * @param outputs An array of Devices the shaft output to
     */
    constructor(id: number, outputs: Device[]) {
        this.currentRotation = 0;
        this.nextRotation = 0;
        this.resultReady = false;
        this.outputs = outputs;
        this.id = id;
    }

    /**
     * @method update
     * @description This method updates the currentRotation with nextRotation and sets resultReady to false
     * @returns void
     */
    update(): void {
        this.currentRotation = this.nextRotation;
        this.resultReady = false;
    }
}