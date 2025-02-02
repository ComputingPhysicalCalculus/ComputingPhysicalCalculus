import { Shaft } from "./Shaft";

export interface Device {
    /*
     * getOutput returns the output of the device
     * if the inputs are not yet ready, it returns undefined
     */
    getOutput() : Shaft | undefined;
}