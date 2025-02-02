import { Shaft } from "./Shaft";

export class Motor {
    private rotation: number;
    private output: Shaft;
    constructor(rotation: number, output: Shaft) {
        this.rotation = rotation;
        this.output = output;
    }
    getOutput(): Shaft {
        if(!this.output.resultReady) {
            this.output.resultReady = true;
            this.output.currentRotation = this.rotation;
            this.output.nextRotation = this.rotation;
        }
        return this.output;
    }
}