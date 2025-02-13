import { Simulator } from "./core/Main";
import { OutputTable } from "./core/OutputTable";

enum State {
  Stopped,
  Running,
  Paused,
  Finished,
}

export class SimulatorHandler {
  private state: State = State.Stopped;
  private simulator: Simulator;
  private start: number = 0;
  private steps_taken: number = 0;

  private resolve_finished!: (value: void | PromiseLike<void>) => void;
  public finished: Promise<void> = new Promise(resolve => {
    this.resolve_finished = resolve;
  })
  public readonly step_period: number;
  public readonly end_point: number;

  public onstep?: (output_tables: OutputTable[]) => void;

  constructor(simulator: Simulator, end_point: number, step_period: number) {
    this.simulator = simulator;
    this.step_period = step_period;
    this.end_point = end_point;
  }

  process_step(timestamp: number): void {
    if (this.state !== State.Running) {
      return;
    }
    
    const elapsed = (timestamp - this.start) / 1000.0;
    const next_steps = Math.floor(elapsed / this.step_period);

    for (; this.steps_taken < next_steps; this.steps_taken++) {
      this.simulator.step();
    }
  }

  has_finished(): boolean {
    return this.state == State.Finished;
  }

  set_motor_rotation(rate: number): void {
    this.simulator.motor?.changeRotation(rate);
  }

  pause(): void {
    if (this.state === State.Finished) {
      return;
    }
    this.state = State.Paused;
  }

  stop(): void {
    if (this.state === State.Finished) {
      return;
    }
    this.state = State.Stopped;
  }

  run(): void {
    if (this.state === State.Finished) {
      return;
    }
    this.state = State.Running;
  }
}
