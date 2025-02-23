/**
 * @file OutputTable.ts
 * @description This file contains the definition of the OutputTable class.
 * @author Simon Solca, Andy Zhu
 */

import { Shaft } from "./Shaft";
import { Device } from "./Device";

/**
 * @class OutputTable
 * @description the OutputTable class which simulates the OutputTable in differential analyzer
 * @implements Device
 */
export class OutputTable implements Device {
  id: number = 0;
  x: Shaft;
  y1: Shaft;
  y2: Shaft | undefined;
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
    this.xHistory = [0];
    this.y1 = y1;
    this.y1History = [initialY1];
    if (y2 != undefined && initialY2 != undefined) {
      this.y2 = y2;
      this.y2History = [initialY2];
    }
  }

  /**
   * @method getOutput
   * @description This method is here to solve inheritiance issues
   * @returns undefined
   */
  determine_output(): Shaft | undefined {
    return undefined;
  }

  /**
   * @method update
   * @description Add the current position to history array for UI
   */
  update(): void {
    // push the new x value on
    this.xHistory.push(this.x.rotation);

    // push the new y value on
    this.y1History.push(this.y1.rotation + this.y1History[0]);

    // check if y2 exists and push if needed
    if (this.y2 != undefined && this.y2History != undefined) {
      this.y2History.push(this.y2.rotation + this.y2History[0]);
    }
  }
}
