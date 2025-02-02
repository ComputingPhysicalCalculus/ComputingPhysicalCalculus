import { Device } from "./Device";

export class Shaft {
    current_rotation: number;
    next_rotation: number;
    result_ready: boolean;
    outputs: Device[];
    constructor(outputs: Device[]) {
        this.current_rotation = 0;
        this.next_rotation = 0;
        this.result_ready = false;
        this.outputs = outputs;
    }
    update(): void {
        this.current_rotation = this.next_rotation;
        this.result_ready = false;
    }
}