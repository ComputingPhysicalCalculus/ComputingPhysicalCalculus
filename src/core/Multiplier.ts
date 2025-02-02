import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Multiplier extends Device {
    output: Shaft;
    constructor(inputs: Shaft[], output: Shaft, initial: number) {
        if(inputs.length != 1) {
            throw new Error("Wrong Length for Multiplier");
        }
        super(inputs, initial);
        this.output = output;
    }
    getOutput(): Shaft | undefined {
        if(this.output.result_ready) {
            return this.output;
        } else if(!this.shafts[0].result_ready) {
            return undefined;
        } else {
            this.output.next_rotation = this.shafts[0].next_rotation * this.initial;
            this.output.result_ready = true;
        }
        return this.output;
    }
}