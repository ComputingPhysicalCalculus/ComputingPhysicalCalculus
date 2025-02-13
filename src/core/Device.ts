/**
 * @file Device.ts
 * @description This file contains the definition of the Device interface.
 * @author Simon Solca, Andy Zhu
 */

import { Shaft } from "./Shaft";

/**
 * @interface Device
 * @description the Device interface has one method, getOutput
 */
export interface Device {
    /**
     * @method determine_output
     * @description This method return Shaft if the inputs are avaliable, otherwise undefined
     * in effect deciding for itself and the setup function within the simulator what its
     * inputs and outputs are
     * @returns The output shaft that represents the output of the device
    */
    determine_output() : Shaft | undefined;
    /**
     * @method update
     * @description This method directly updates the rotation rate of its output
    */
    update() : void;
}