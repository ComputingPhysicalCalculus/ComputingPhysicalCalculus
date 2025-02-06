/**
 * @file MockDevice.ts
 * @description This file contains the definition of the MockShaft class.
 * @author Simon Solca
*/

import { MockDevice } from './MockDevice';


/**
 * @class MockShaft
 * @description An imitation of the Shaft class used for testing purposes
*/
export class MockShaft {
    currentRotation: number;
    nextRotation: number;
    resultReady: boolean;
    outputs: MockDevice[];
    id: number;

    /**
     * @constructor
     * @description The constructor of the MockShaft class.
     * @param number_of_mock_devices The length array of MockDevices for testing
    */
    constructor(number_of_mock_devices: number) {
        this.currentRotation = 0;
        this.nextRotation = 0;
        this.resultReady = false;
        // create array of length of the 
        this.outputs = Array.from({length: number_of_mock_devices}, (_, i)  =>
             new MockDevice());
        this.id = 2;
    }

    /**
     * @method update
     * @description This method is same as Shaft but is never called
     * @returns void
     */
    update(): void {
        this.currentRotation = this.nextRotation;
        this.resultReady = false;
    }

    /**
     * @method equals
     * @description Compares two MockShafts for testing purposes
     * @returns boolean
    */
    public equals(obj: MockShaft) : boolean { 
        if (obj.currentRotation != this.currentRotation){
            return false;
        }
        if (obj.nextRotation != this.nextRotation){
            return false;
        }
        if (obj.resultReady != this.resultReady){
            return false;
        }
        if (obj.outputs.length != this.outputs.length){
            return false;
        }
        for (let i = 0; i < this.outputs.length; i++){
            if (!(this.outputs[i] === obj.outputs[i])){
                return false;
            }
        }
        return true;
    }
    
    /**
     * @method toJSON
     * @description JSONifies the MockShaft for testing comparisions
    */
    public toJSON(){
        return {
            currentRotation: this.currentRotation,
            nextRotation: this.nextRotation,
            resultReady: this.resultReady,
            outputs: this.outputs.map(output => output.toJSON ? output.toJSON() : output),
        };
    }
}
