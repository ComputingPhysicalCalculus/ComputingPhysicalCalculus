import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Differential extends Device {
    constructor(shafts: Shaft[]) {
        super(shafts, 0);
    }
}