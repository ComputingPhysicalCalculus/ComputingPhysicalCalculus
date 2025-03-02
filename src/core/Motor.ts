/**
 * @file Motor.ts
 * @description This file contains the definition of the Motor class.
 * @author Simon Solca, Andy Zhu
 */

import { Shaft } from "./Shaft";
import { Device } from "./Device";

/**
 * @class Motor
 * @description the Motor class which simulates the motor driving the differential analyzer
 */
export class Motor implements Device{
    private rotation: number;
    private output: Shaft;
    id: number;

    /**
     * @constructor
     * @description The constructor of the Motor class.
     * @param rotation The rotation speed of the motor
     * @param output The output shaft
     */
    constructor(id: number, rotation: number, output: Shaft) {
        this.id = id;
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
    determine_output(){
        return this.output;
    }

    /**
     * @method update
     * @description Sets the outputs rotation rate to be the motors rotation rate
    */
    update(dt: number = 1){
        this.output.set_rotation_rate(this.rotation * dt);
    }

    getID() : number { return this.id; }
}