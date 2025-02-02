import { Shaft } from "./Shaft";
import { Device } from "./Device";

export class OutputTable implements Device {
    x: Shaft;
    y1: Shaft;
    y2: Shaft | undefined;
    initial_y1: number;
    initial_y2: number | undefined;
    constructor(x: Shaft, y1: Shaft, initial_y1: number, y2: Shaft, initial_y2: number);
    constructor(x: Shaft, y1: Shaft, initial_y1: number);
    constructor(x: Shaft, y1: Shaft, initial_y1: number, y2?: Shaft, initial_y2?: number) {
        this.x = x;
        this.y1 = y1;
        this.initial_y1 = initial_y1;
        if(y2 != undefined && initial_y2 != undefined) {
            this.y2 = y2;
            this.initial_y2 = initial_y2;
        }
    }
    getOutput(): Shaft | undefined {
        return undefined;
    }
    addPlot(): void {
        // TODO: add plot 
    }
}