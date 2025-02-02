import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Integrator extends Device {
    output: Shaft;
    constructor(inputs: Shaft[], output: Shaft, initial: number) {
        if(inputs.length != 2) {
            throw new Error("Wrong Length for Integrator");
        }
        super(inputs, initial);
        this.output = output;
    }
    getOutput(): Shaft | undefined {
        // TODO: do the integrator part
        return this.output;
    }
}