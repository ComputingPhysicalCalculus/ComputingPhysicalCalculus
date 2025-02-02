export class Shaft {
    current_rotation: number;
    next_rotation: number;
    result_ready: boolean;
    constructor(rotation: number) {
        this.current_rotation = rotation;
        this.next_rotation = -1;
        this.result_ready = false;
    }
    update(): void {
        this.current_rotation = this.next_rotation;
    }
}