/**
 * @file IntegrationTest.test.ts
 * @description This file contains Integration Test for the 2sin(t) + t -> -2cos(t) + 1/2 t^2
 * @author Simon Solca
*/


import { Differential } from "../../src/core/Differential";
import { Integrator } from "../../src/core/Integrator";
import { Multiplier } from "../../src/core/Multiplier";
import { FunctionTable } from "../../src/core/FunctionTable";
import { OutputTable } from "../../src/core/OutputTable";
import { Motor } from "../../src/core/Motor";
import { Simulator } from "../../src/core/Main";
import { Shaft } from "../../src/core/Shaft";
import { CrossConnect } from "../../src/core/CrossConnect";
import { assert, test, describe, expect, it } from 'vitest'
import { PPMC, binary_search, MSE } from "./TestingUtil.ts";
import fs from 'fs';

const WRITE_TO_FILE = false;

/**
 * @function test_diff_eq
 * @description test for the int of 2sin(t) + t = -2cos(t) + 1/2 t^2
 * @return x value
 * @author Simon Solca
*/
function test_simple_integral() {
  // number of cycles
  const N = 1000;
  // test statistic
  const PPMC_THRESHOLD = 0.9999;
  const MSE_THRESHOLD = 0.001;

  let rotation_rate = 6 / N;


  // initialise shafts
  let shaft_t = new Shaft(0, []);
  let shaft_t_into_sin = new Shaft(5, []);
  let shaft_t_into_integrator = new Shaft(6, []);
  let shaft_sint = new Shaft(1, []);
  let shaft_f_to_shaft_sint = new Shaft(7, []);
  let shaft_two_sint = new Shaft(2, []);
  let shaft_two_sint_plus_t = new Shaft(3, []);
  let shaft_intt = new Shaft(4, []);

  // initialise the devices
  let function_table = new FunctionTable(1, shaft_t_into_sin, shaft_f_to_shaft_sint, 0, Math.sin);
  let multi = new Multiplier(2, shaft_sint, shaft_two_sint, 2);
  let diff = new Differential(3, shaft_two_sint, shaft_t, shaft_two_sint_plus_t);
  let integrator = new Integrator(4, shaft_t_into_integrator, shaft_two_sint_plus_t, shaft_intt, false, 0);
  let output_table = new OutputTable(5, shaft_t, shaft_two_sint_plus_t, 0, shaft_intt, -2);
  let cross_connect_sin = new CrossConnect(6, shaft_t, shaft_t_into_sin, false);
  let cross_connect_int = new CrossConnect(7, shaft_t, shaft_t_into_integrator, false);
  let cross_connect_f_to_sin = new CrossConnect(8, shaft_f_to_shaft_sint, shaft_sint, false);

  // initialise motor
  let motor = new Motor(9, rotation_rate, shaft_t);

  // set the outputs
  shaft_t.outputs = [cross_connect_sin, cross_connect_int, output_table, diff];
  shaft_t_into_sin.outputs = [function_table];
  shaft_t_into_integrator.outputs = [integrator];
  shaft_f_to_shaft_sint.outputs = [cross_connect_f_to_sin];
  shaft_sint.outputs = [multi];
  shaft_intt.outputs = [output_table];
  shaft_two_sint.outputs = [diff];
  shaft_two_sint_plus_t.outputs = [integrator, output_table]

  // add all the attributes to the simulator
  let simulator = new Simulator()
  let shafts = [shaft_intt, shaft_two_sint_plus_t, shaft_t, shaft_sint, shaft_two_sint, shaft_t_into_integrator, shaft_t_into_sin];
  let devices = [multi, diff, function_table, integrator, output_table, cross_connect_int, cross_connect_sin, cross_connect_f_to_sin];
  simulator.shafts = shafts;
  simulator.motor = motor;
  simulator.outputTables = [output_table];
  simulator.components = devices;

  // setup the simulator
  simulator.setup();

  // step through N times
  for (let i = 0; i < N; i++) {
    simulator.step();
  }

  // t values and x values
  let t = simulator.outputTables[0].xHistory;
  let x = simulator.outputTables[0].y2History!;

  // integrated function
  let F = (v: number) => -2 * Math.cos(v) + 0.5 * v * v;
  // true values for comparision
  let true_values = Array.from({ length: N + 1 }, (_, i) => F(t[i]));


  if (WRITE_TO_FILE) {
    const lines: string[] = [];
    for (let i = 0; i < x.length; i++) {
      const line = `${t[i]}, ${x[i]}, ${true_values[i]}`;
      lines.push(line);
    }

    fs.writeFileSync("tests/core/data1.txt", lines.join('\n'), 'utf-8');
  }


  let r = PPMC(x, true_values);
  let m = MSE(x, true_values);

  expect(r).toBeGreaterThan(PPMC_THRESHOLD);
  expect(m).toBeLessThan(MSE_THRESHOLD);
};




test("Testing integral of 2sin(t) + t", test_simple_integral)
