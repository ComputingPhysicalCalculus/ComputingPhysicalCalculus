import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Integrator implements Device {
    output: Shaft;
    disk_position: number;
    integrand: Shaft;
    variable_of_integration: Shaft;
    constructor(
        variable_of_integration: Shaft, 
        integrand: Shaft, 
        output: Shaft, 
        initial_disk_position: number
    ) {
        this.output = output;
        this.integrand = integrand;
        this.disk_position = initial_disk_position;
        this.variable_of_integration = variable_of_integration;
    }
    getOutput(): Shaft | undefined {
        this.disk_position += this.integrand.current_rotation;
        return this.output;
    }
}