import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable extends Device {
    output: Shaft;
    fun: (n: number) => number;
    constructor(inputs: Shaft[], output: Shaft, initial: number, fun: (n: number) => number) {
        super(inputs, initial);
        this.output = output;
        this.fun = fun;
    }
}