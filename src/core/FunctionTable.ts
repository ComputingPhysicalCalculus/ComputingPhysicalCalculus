import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable implements Device {
    output: Shaft;
    x_position: number;
    fun: (n: number) => number;
    input: Shaft;
    constructor(input: Shaft, output: Shaft, initial_x_position: number, fun: (n: number) => number) {
        this.input = input;
        this.output = output;
        this.fun = fun;
        this.x_position = initial_x_position;
    }
    getOutput(): Shaft | undefined {
        if(!this.output.result_ready) {
            this.x_position += this.input.next_rotation;
            this.output.result_ready = true;
            this.output.next_rotation = this.fun(this.x_position);
        }
        return this.output;
    }
}