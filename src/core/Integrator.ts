import { Device } from "./Device";
import { Shaft } from "./Shaft";

export class Integrator implements Device {
    private output: Shaft;
    private disk_position: number;
    private integrand: Shaft;
    private variable_of_integration: Shaft;
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