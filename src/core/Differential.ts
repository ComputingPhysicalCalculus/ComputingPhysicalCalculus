import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Differential implements Device {
    private output: Shaft | undefined;
    // the sum shaft is always in the middle
    private shafts: Shaft[];
    constructor(diffShaft1: Shaft, diffShaft2: Shaft, sumShaft: Shaft) {
        this.shafts = [diffShaft1, sumShaft, diffShaft2];
    }
    getOutput() : Shaft | undefined {
        let count: number = 0
        for(let shaft of this.shafts) {
            if(shaft.resultReady) {
                count += 1;
            }
        }
        if(count == 2) {
            let idx: number = 0;
            for(let i = 0;i<3;++i) {
                if(!this.shafts[i].resultReady) {
                    idx = i;
                }
            }
            if(idx == 0) {
                this.shafts[0].resultReady = true;
                this.shafts[0].nextRotation = this.shafts[1].nextRotation - this.shafts[2].nextRotation;
            } else if(idx == 1) {
                this.shafts[1].resultReady = true;
                this.shafts[1].nextRotation = this.shafts[0].nextRotation + this.shafts[2].nextRotation;
            } else {
                this.shafts[2].resultReady = true;
                this.shafts[2].nextRotation = this.shafts[1].nextRotation - this.shafts[0].nextRotation;
            }
            this.output = this.shafts[idx];
        } 
        return this.output;
    }
}