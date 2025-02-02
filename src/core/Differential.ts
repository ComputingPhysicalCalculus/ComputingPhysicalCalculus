import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Differential implements Device {
    private output: Shaft | undefined;
    // the sum shaft is always in the middle
    private shafts: Shaft[];
    constructor(diff_shaft1: Shaft, diff_shaft2: Shaft, sum_shaft: Shaft) {
        this.shafts = [diff_shaft1, sum_shaft, diff_shaft2];
    }
    getOutput() : Shaft | undefined {
        let count: number = 0
        for(let shaft of this.shafts) {
            if(shaft.result_ready) {
                count += 1;
            }
        }
        if(count == 2) {
            let idx: number = 0;
            for(let i = 0;i<3;++i) {
                if(!this.shafts[i].result_ready) {
                    idx = i;
                }
            }
            if(idx == 0) {
                this.shafts[0].result_ready = true;
                this.shafts[0].next_rotation = this.shafts[1].next_rotation - this.shafts[2].next_rotation;
            } else if(idx == 1) {
                this.shafts[1].result_ready = true;
                this.shafts[1].next_rotation = this.shafts[0].next_rotation + this.shafts[2].next_rotation;
            } else {
                this.shafts[2].result_ready = true;
                this.shafts[2].next_rotation = this.shafts[1].next_rotation - this.shafts[0].next_rotation;
            }
            this.output = this.shafts[idx];
        } 
        return this.output;
    }
}