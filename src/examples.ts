import { Config } from "./config";

import _linear_integration_example from "../examples/integrating-linear.json";
import _spring_example from "../examples/spring-example.json";

export const SPRING_EXAMPLE: Config = _spring_example as any;
export const LINEAR_INTEGRATION_EXAMPLE: Config = _linear_integration_example as any;

import _dangling_shaft from "../examples/broken/dangling-shaft.json";

export const BROKEN_DANGLING_SHAFT: Config = _dangling_shaft as any;
