import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Differential implements Device {
    output: Shaft | undefined;
    shafts: Shaft[];
    constructor(shafts: Shaft[]) {
        if(shafts.length != 3) {
            throw new Error("Wrong Length for Differential");
        }
        this.shafts = shafts;
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