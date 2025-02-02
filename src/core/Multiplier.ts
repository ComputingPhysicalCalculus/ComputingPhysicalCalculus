import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Multiplier extends Device {
    output: Shaft;
    constructor(inputs: Shaft[], output: Shaft, initial: number) {
        super(inputs, initial);
        this.output = output;
    }
}