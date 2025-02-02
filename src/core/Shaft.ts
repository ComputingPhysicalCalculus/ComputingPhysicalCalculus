export class Shaft {
    current_rotation: number;
    next_rotation: number;
    constructor(rotation: number) {
        this.current_rotation = rotation;
        this.next_rotation = 0;
    }
    update(): void {
        this.current_rotation = this.next_rotation;
    }
}