import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class FunctionTable extends Device {
    constructor(inputs: Shaft[], initial: number) {
        super(inputs, initial);
        
    }
}