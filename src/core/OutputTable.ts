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
    this.xHistory = [x.get_rotation_rate()];
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
    let x_length = this.xHistory.length;
    let new_x = this.xHistory[x_length - 1] + this.x.get_rotation_rate();
    this.xHistory.push(new_x);

    // push the new y value on
    let y1_length = this.y1History.length;
    let new_y1 = Number(this.y1History[y1_length - 1]) + this.y1.get_rotation_rate();
    this.y1History.push(new_y1);

    // check if y2 exists and push if needed
    if (this.y2 != undefined && this.y2History != undefined) {
      let y2_length = this.y2History.length;
      let new_y2 = Number(this.y2History[y2_length - 1]) + this.y2.get_rotation_rate();
      this.y2History.push(new_y2);
    }
  }
}
