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
    private rotation_rate: number;
    rotation: number;
    outputs: MockDevice[];
    id: string;
    // used in the setup of the sim only
    ready_flag: boolean = false;

    /**
     * @constructor
     * @description The constructor of the Shaft class.
     * @param outputs An array of Devices the shaft output to
     */
    constructor(number_of_mock_devices: number) {
        this.rotation_rate = 0;
        this.rotation = 0;
        this.outputs = Array.from({length: number_of_mock_devices}, (_, i)  =>
            new MockDevice());
       this.id = Math.random().toString(32);
    }

    /**
     * @method update
     * @description adds the rotation rate to the current rotation
    */
    update(): void {
        this.rotation += this.rotation_rate;
    }

    
    set_rotation_rate(rate: number): void{
        this.rotation_rate = rate;
    }

    get_rotation_rate(): number{
        return this.rotation_rate;
    }

    public equals(obj: MockShaft) : boolean { 
        if (obj.get_rotation_rate() != this.rotation_rate){
            return false;
        }
        if (obj.rotation != this.rotation){
            return false;
        }
        if (obj.ready_flag != this.ready_flag){
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

    public toJSON(){
        return {
            rotation_rate: this.rotation_rate,
            ready_flag: this.ready_flag,
            outputs: this.outputs.map(output => output.toJSON ? output.toJSON() : output),
        };
    }
}