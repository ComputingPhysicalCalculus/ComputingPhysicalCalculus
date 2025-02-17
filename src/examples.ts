import { Config } from "./config";

import _integrating_linear from "../examples/integrating-linear.json";
import _example_config from "../examples/spring-example.json";

export const EXAMPLE_CONFIG: Config = _example_config as any;
export const INTEGRATING_LINEAR: Config = _integrating_linear as any;

import _dangling_shaft from "../examples/broken/dangling-shaft.json";

export const BROKEN_DANGLING_SHAFT: Config = _dangling_shaft as any;
