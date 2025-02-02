import { Shaft } from "./Shaft";

export class Device {
    shafts: Shaft[];
    initial: number;
    constructor(shafts: Shaft[], initial: number) {
        this.shafts = shafts;
        this.initial = initial
    }
}