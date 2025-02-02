import { Device } from "./Device";

export class Shaft {
    currentRotation: number;
    nextRotation: number;
    resultReady: boolean;
    outputs: Device[];
    constructor(outputs: Device[]) {
        this.currentRotation = 0;
        this.nextRotation = 0;
        this.resultReady = false;
        this.outputs = outputs;
    }
    update(): void {
        this.currentRotation = this.nextRotation;
        this.resultReady = false;
    }
}