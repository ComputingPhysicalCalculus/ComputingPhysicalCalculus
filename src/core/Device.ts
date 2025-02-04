/**
 * @file Device.ts
 * @description This file contains the definition of the Device interface.
 * @author Andy Zhu
 */

import { Shaft } from "./Shaft";

/**
 * @interface Device
 * @description the Device interface has one method, getOutput
 */
export interface Device {
    /**
     * @method getOutput
     * @description This method return Shaft if the inputs are avaliable, otherwise undefined
     * @returns The output shaft that represents the output of the device
     */
    getOutput() : Shaft | undefined;
}