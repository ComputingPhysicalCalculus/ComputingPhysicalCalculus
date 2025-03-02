// import { InputGraph, OutputGraph } from "./UI/Graph";
// import Vector2 from "./UI/Vector2";

import "./decorators";
import { Lifecycle } from "./Lifecycle.ts";

// Register custom elements
import "./UI/IntegratorComponent";
import "./UI/GraphElement";
import "./UI/DraggableElement";
import "./UI/GraphElement";
import "./UI/ShaftElement";
import "./UI/MotorComponent";
import "./UI/CrossConnectComponentElement";
import "./UI/DifferentialComponentElement";
import "./UI/MultiplierComponentElement";
import "./UI/GearPairComponentElement";
import "./UI/DialComponentElement";
import "./UI/CustomVariablesElement";
import "./expr/Expression.ts";

import "./run.ts";

// Give the example configuration a type

/**
 * Generates n data points of a function in a specified range
 */
export const generator = function*(n: number, min: number, max: number, f: (x: number) => number) {
    for (let i = min; i < max; i += (max - min) / n) {
        yield { x: i, y: f(i) };
    }
}

// Start the application
window.onload = () => {
    const lifecycle = new Lifecycle();
    lifecycle.setup();
}


