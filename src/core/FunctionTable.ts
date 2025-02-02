import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable extends Device {
    output: Shaft;
    fun: (n: number) => number;
    constructor(inputs: Shaft[], output: Shaft, initial: number, fun: (n: number) => number) {
        if(inputs.length != 1) {
            throw new Error("Wrong Length for FunctionTable");
        }
        super(inputs, initial);
        this.output = output;
        this.fun = fun;
    }
    getOutput(): Shaft | undefined {
        // TODO: finish function table;
        return this.output;
    }
}