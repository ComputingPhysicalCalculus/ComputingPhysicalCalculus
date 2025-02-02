import { Shaft } from "./Shaft";
import { Device } from "./Device";

export class OutputTable extends Device {
    constructor(inputs: Shaft[], initial: number) {
        if(inputs.length != 3) {
            throw new Error("Wrong Length for OutputTable");
        }
        super(inputs, initial);
    }
    getOutput(): Shaft | undefined {
        return undefined;
    }
}