import { Shaft } from "./Shaft";
import { Device } from "./Device";

export class OutputTable implements Device {
    private x: Shaft;
    private y1: Shaft;
    private y2: Shaft | undefined;
    private xHistory: number[];
    private y1History: number[];
    private y2History: number[] | undefined;
    constructor(x: Shaft, y1: Shaft, initialY1: number, y2: Shaft, initialY2: number);
    constructor(x: Shaft, y1: Shaft, initialY1: number);
    constructor(x: Shaft, y1: Shaft, initialY1: number, y2?: Shaft, initialY2?: number) {
        this.x = x;
        this.xHistory = []
        this.y1 = y1;
        this.y1History = [initialY1];
        if(y2 != undefined && initialY2 != undefined) {
            this.y2 = y2;
            this.y2History = [initialY2];
        }
    }
    getOutput(): Shaft | undefined {
        return undefined;
    }
    addPlot(): void {
        this.xHistory.push(this.xHistory[this.xHistory.length - 1] + this.x.currentRotation);
        this.y1History.push(this.y1History[this.y1History.length - 1] + this.y1.currentRotation);
        if(this.y2 != undefined && this.y2History != undefined) {
            this.y2History.push(this.y2History[this.y2History.length - 1] + this.y2.currentRotation);
        }
    }
}