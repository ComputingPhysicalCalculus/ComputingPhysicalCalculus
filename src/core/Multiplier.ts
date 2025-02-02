import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Multiplier implements Device {
    output: Shaft;
    factor: number;
    input: Shaft;
    constructor(input: Shaft, output: Shaft, factor: number) {
        this.factor = factor
        this.input = input;
        this.output = output;
    }
    getOutput(): Shaft | undefined {
        if(this.output.result_ready) {
            return this.output;
        } else if(!this.input.result_ready) {
            return undefined;
        } else {
            this.output.next_rotation = this.input.next_rotation * this.factor;
            this.output.result_ready = true;
        }
        return this.output;
    }
}