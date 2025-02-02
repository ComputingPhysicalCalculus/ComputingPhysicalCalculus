import { Shaft } from "./Shaft";

export class OutputTable {
    inputs: Shaft[];
    initial: number;
    constructor(inputs: Shaft[], initial: number) {
        if(inputs.length != 3) {
            throw new Error("Wrong Length for OutputTable");
        }
        this.inputs = inputs;
        this.initial = initial;
    }
}