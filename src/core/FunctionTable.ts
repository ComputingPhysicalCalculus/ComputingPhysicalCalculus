import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable implements Device {
    private output: Shaft;
    private x_position: number;
    private fun: (n: number) => number;
    private input: Shaft;
    constructor(input: Shaft, output: Shaft, initial_x_position: number, fun: (n: number) => number) {
        this.input = input;
        this.output = output;
        this.fun = fun;
        this.x_position = initial_x_position;
    }
    getOutput(): Shaft | undefined {
        if(!this.output.resultReady) {
            this.x_position += this.input.nextRotation;
            this.output.resultReady = true;
            this.output.nextRotation = this.fun(this.x_position);
        }
        return this.output;
    }
}