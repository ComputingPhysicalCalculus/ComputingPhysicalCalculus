import { Shaft } from "./Shaft";

export abstract class Device {
    protected shafts: Shaft[];
    protected initial: number;
    constructor(shafts: Shaft[], initial: number) {
        this.shafts = shafts;
        this.initial = initial
    }
    abstract getOutput() : Shaft | undefined;
}