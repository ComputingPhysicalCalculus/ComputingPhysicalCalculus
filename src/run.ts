import { Config } from "./config";
import { FunctionTable } from "./core/FunctionTable";
import { Integrator } from "./core/Integrator";
import { Simulator } from "./core/Main";
import { Motor } from "./core/Motor";
import { OutputTable } from "./core/OutputTable";
import { Shaft } from "./core/Shaft";

export function export_simulator(_config: Config, motor_speed: number): Simulator {
  let shaft_t = new Shaft(0, []);
  let shaft_sint = new Shaft(1, []);
  let shaft_intt = new Shaft(2, []);

  let function_table = new FunctionTable(shaft_t, shaft_sint, 0, Math.sin);
  let integrator = new Integrator(shaft_t, shaft_sint, shaft_intt, false, 0);
  let output_table = new OutputTable(shaft_t, shaft_sint, 0, shaft_intt, -1);
  
  let motor = new Motor(motor_speed, shaft_t);

  shaft_t.outputs = [function_table, integrator, output_table];
  shaft_sint.outputs = [integrator, output_table];
  shaft_intt.outputs = [output_table];

  let shafts = [shaft_t, shaft_sint, shaft_intt];
  let devices = [function_table, integrator, output_table];
  let simulator = new Simulator()
  simulator.shafts = shafts;
  simulator.motor = motor;
  simulator.outputTables = [output_table];
  simulator.components = devices;

  return simulator;
}


