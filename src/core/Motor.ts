import { Shaft } from "./Shaft";

export class Motor {
    private rotation: number;
    private output: Shaft;
    constructor(rotation: number, output: Shaft) {
        this.rotation = rotation;
        this.output = output;
    }
    getOutput(): Shaft {
        if(!this.output.result_ready) {
            this.output.result_ready = true;
            this.output.current_rotation = this.rotation;
            this.output.next_rotation = this.rotation;
        }
        return this.output;
    }
}