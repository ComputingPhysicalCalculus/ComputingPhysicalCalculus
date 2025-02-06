/**
 * @file MockDevice.ts
 * @description This file contains the definition of the MockDevice class.
 * @author Simon Solca
*/

import { Device } from '@src/core/Device';
import { Shaft } from '@src/core/Shaft';


/**
 * @class MockDevice
 * @description A generic Device subclass for testing purposes
*/
export class MockDevice implements Device{
    // Has unique_id for equality checks
    public unique_id: string;

    /**
     * @constructor
     * @description Generates a pseudorandom unique id for this instance
    */
    constructor() {
        this.unique_id = Math.random().toString(32);
    }

    getOutput(): Shaft | undefined {
        return null;
    }

    /**
     * @method equals
     * @description Compares two MockDevices for testing purposes
     * @returns boolean
    */
    public equals(obj: MockDevice) : boolean { 
        return this.unique_id == obj.unique_id;
    }

    /**
     * @method toJSON
     * @description JSONifies the MockShaft for testing comparisions
    */
    public toJSON() {
        return { unique_id: this.unique_id};
    }
}


