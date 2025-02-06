/**
 * @file OutputTable.ts
 * @description This file contains the definition of the OutputTable class.
 * @author Andy Zhu
 */

import { Shaft } from "./Shaft";
import { Device } from "./Device";

/**
 * @class OutputTable
 * @description the OutputTable class which simulates the OutputTable in differential analyzer
 * @implements Device
 */
export class OutputTable implements Device {
    private x: Shaft;
    private y1: Shaft;
    private y2: Shaft | undefined;
    xHistory: number[];
    y1History: number[];
    y2History: number[] | undefined;
    constructor(x: Shaft, y1: Shaft, initialY1: number, y2: Shaft, initialY2: number);
    constructor(x: Shaft, y1: Shaft, initialY1: number);

    /**
     * @constructor
     * @description The constructor of the OutputTable class.
     * @param x The shaft of x-axis 
     * @param y1 The shaft of the first y axis
     * @param initialY1 The initial position of the first y axis
     * @param y2 The shaft of the second y axis 
     * @param initialY2 The initial position of the second y axis
     */
    constructor(x: Shaft, y1: Shaft, initialY1: number, y2?: Shaft, initialY2?: number) {
        this.x = x;
        this.xHistory = [x.currentRotation];
        this.y1 = y1;
        this.y1History = [initialY1];
        if(y2 != undefined && initialY2 != undefined) {
            this.y2 = y2;
            this.y2History = [initialY2];
        }
    }
    
    /**
     * @method getOutput
     * @description This method is here to solve inheritiance issues
     * @returns undefined
     */
    getOutput(): Shaft | undefined {
        return undefined;
    }

    /**
     * @method addPlot
     * @description Add the current position to history array for UI
     * @returns void
     */
    addPlot(): void {
        console.log(this.xHistory.length);
        this.xHistory.push(this.xHistory[this.xHistory.length - 1] + this.x.currentRotation);
        this.y1History.push(this.y1History[this.y1History.length - 1] + this.y1.currentRotation);
        if(this.y2 != undefined && this.y2History != undefined) {
            this.y2History.push(this.y2History[this.y2History.length - 1] + this.y2.currentRotation);
        }
    }
}
