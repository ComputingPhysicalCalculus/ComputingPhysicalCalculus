import { Config } from "./config";

import _linear_integration_example from "../examples/integrating-linear.json";
import _spring_example from "../examples/spring-example.json";
import _weierstrauss_function_example from "../examples/weierstrauss-function.json";
import _gamma_function_example from "../examples/gamma-function.json";
import _gear_pair_example from "../examples/gear-pair.json";
import _epicycloid_example from "../examples/integrating-epicycloid.json";
import _extreme_epicycloid from "../examples/epicycloid-from-components.json";
import _freefall_example from "../examples/body-in-free-fall.json";
import _oscillation_example from "../examples/spring-example-2.json";
import _duffing_equation_example from "../examples/duffing-equation.json";
import _population_growth_example from "../examples/population-growth.json";
import _simple_pendulum_example from "../examples/simple-pendulum.json";
import _double_pendulum_example from "../examples/double-pendulum.json";

export const SPRING_EXAMPLE: Config = _spring_example as any;
export const LINEAR_INTEGRATION_EXAMPLE: Config = _linear_integration_example as any;
export const WEIERSTRAUSS_FUNCTION_EXAMPLE: Config = _weierstrauss_function_example as any;
export const GAMMA_FUNCTION_EXAMPLE: Config = _gamma_function_example as any;
export const GEAR_PAIR_EXAMPLE: Config = _gear_pair_example as any;
export const EPICYCLOID_EXAMPLE: Config = _epicycloid_example as any;
export const EXTREME_EPICYCLOID_EXAMPLE: Config = _extreme_epicycloid as any;
export const FREE_FALL_EXAMPLE: Config = _freefall_example as any;
export const OSCILLATION_EXAMPLE: Config = _oscillation_example as any;
export const DUFFING_EQUATION_EXAMPLE: Config = _duffing_equation_example as any;
export const POPULATION_GROWTH_EXAMPLE: Config = _population_growth_example as any;
export const SIMPLE_PENDULUM_EXAMPLE: Config = _simple_pendulum_example as any;
export const DOUBLE_PENDULUM_EXAMPLE: Config = _double_pendulum_example as any;

import _dangling_shaft from "../examples/broken/dangling-shaft.json";

export const BROKEN_DANGLING_SHAFT: Config = _dangling_shaft as any;
