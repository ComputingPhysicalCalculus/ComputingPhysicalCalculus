// import { InputGraph, OutputGraph } from "./UI/Graph";
// import Vector2 from "./UI/Vector2";

import "./decorators";
import { Lifecycle } from "./Lifecycle.ts";
import { Config } from "./config.ts";

// Register custom elements
import "./UI/IntegratorComponent";
import "./UI/GraphElement";
import "./UI/DraggableElement";
import "./UI/GraphElement";
import "./UI/ShaftElement";
import "./UI/MotorComponent";
import "./UI/GearComponentElement";
import "./UI/DifferentialComponentElement";

// Give the example configuration a type
import _example_config from "../integrating-linear.json";
export const EXAMPLE_CONFIG: Config = _example_config as any;

/**
 * Generates n data points of a function in a specified range
 */
export const generator = function*(n: number, min: number, max: number, f: (x: number) => number) {
    for (let i = min; i < max; i += (max - min) / n) {
        yield { x: i, y: f(i) };
    }
}

// Start the application
const lifecycle = new Lifecycle();

window.lifecycle = lifecycle;

window.onload = () => lifecycle.setup();


