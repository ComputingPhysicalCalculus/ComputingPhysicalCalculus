/**
 * @file Integrator.ts
 * @description This file contains the definition of the Integrator class, which implements the Device interface.
 * The Integrator class is responsible for integrating the input shafts and providing an output shaft.
 * @author Hanzhang Shen
 */

import { Device } from "./Device";
import { Shaft } from "./Shaft";

/**
 * @class Integrator
 * @description The Integrator class is responsible for integrating the input shafts and providing an output shaft.
 * @implements Device
 */
export class Integrator implements Device {
    private output: Shaft;
    private integrand: Shaft;
    private variableOfIntegration: Shaft;
    private readonly wheelRadius: number = 1;
    private reverse: boolean = false;

    /**
     * @constructor
     * @description The constructor of the Integrator class.
     * @param variableOfIntegration The shaft that represents the differential dx.
     * @param integrand The shaft that represents the integrand f(x).
     * @param output The output shaft that represents the angular speed of the wheel.
     */
    constructor(
        variableOfIntegration: Shaft,
        integrand: Shaft,
        output: Shaft,
        reverse: boolean
    ) {
        this.output = output;
        this.integrand = integrand;
        this.variableOfIntegration = variableOfIntegration;
        this.reverse = reverse
    }

    /**
     * @method getOutput
     * @description This method calculates the angular speed of the wheel by integrating the input shafts.
     * @returns The output shaft that represents the angular speed of the wheel.
     */
    getOutput(): Shaft | undefined {
        // Linear speed of the wheel = f(x) * dx.
        if(!this.variableOfIntegration.resultReady) return undefined;
        let wheelLinearSpeed: number = this.variableOfIntegration.currentRotation * this.integrand.currentRotation;
        let wheelAngularSpeed: number = wheelLinearSpeed / this.wheelRadius;
        if (this.reverse)
            wheelAngularSpeed = -wheelAngularSpeed
        this.output.nextRotation = wheelAngularSpeed;
        return this.output;
    }
}
