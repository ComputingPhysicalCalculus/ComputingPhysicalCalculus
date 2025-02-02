import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Multiplier implements Device {
    private output: Shaft;
    private factor: number;
    private input: Shaft;
    constructor(input: Shaft, output: Shaft, factor: number) {
        this.factor = factor
        this.input = input;
        this.output = output;
    }
    getOutput(): Shaft | undefined {
        if(this.output.resultReady) {
            return this.output;
        } else if(!this.input.resultReady) {
            return undefined;
        } else {
            this.output.nextRotation = this.input.nextRotation * this.factor;
            this.output.resultReady = true;
        }
        return this.output;
    }
}