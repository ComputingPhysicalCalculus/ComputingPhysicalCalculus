/**
 * @file Motor.ts
 * @description This file contains the definition of the Motor class.
 * @author Andy Zhu
 */

import { Shaft } from "./Shaft";

/**
 * @class Motor
 * @description the Motor class which simulates the motor driving the differential analyzer
 */
export class Motor {
    private rotation: number;
    private output: Shaft;

    /**
     * @constructor
     * @description The constructor of the Motor class.
     * @param rotation The rotation speed of the motor
     * @param output The output shaft
     */
    constructor(rotation: number, output: Shaft) {
        this.rotation = rotation;
        this.output = output;
    }

    /**
     * @method changeRotation
     * @description This method changes the rotation of motor
     * @returns void
     */
    changeRotation(rotation: number): void {
        this.rotation = rotation;
    }
    
    /**
     * @method getOutput
     * @description This method returns the output shaft
     * @returns The output shaft
     */
    getOutput(): Shaft {
        if(!this.output.resultReady) {
            this.output.resultReady = true;
            this.output.currentRotation = this.rotation;
            this.output.nextRotation = this.rotation;
        }
        return this.output;
    }
}