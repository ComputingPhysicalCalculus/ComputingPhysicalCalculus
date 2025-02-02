import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable extends Device {
    output: Shaft;
    Xposition: number;
    fun: (n: number) => number;
    constructor(inputs: Shaft[], output: Shaft, initial: number, fun: (n: number) => number) {
        if(inputs.length != 1) {
            throw new Error("Wrong Length for FunctionTable");
        }
        super(inputs, initial);
        this.output = output;
        this.fun = fun;
        this.Xposition = initial;
    }
    getOutput(): Shaft | undefined {
        if(!this.output.result_ready) {
            this.Xposition += this.shafts[0].next_rotation;
            this.output.result_ready = true;
            this.output.next_rotation = this.fun(this.Xposition);
        }
        return this.output;
    }
}