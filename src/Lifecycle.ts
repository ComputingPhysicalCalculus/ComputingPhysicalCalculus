import { Config, loadConfig } from "./config";
import { toConfig } from "./GenerateConfigFromUI";
import { query, queryAll } from "./decorators";
import { INTEGRATING_LINEAR } from "./examples";
import { setupDragHooks } from "./UI/Drag";
import { DraggableComponentElement } from "./UI/DraggableElement";
import { GRID_SIZE, resetScreenOffset, setCells, setScreenOffset, setupScreenHooks } from "./UI/Grid";
import { setupSelectHooks } from "./UI/SelectShaft.ts";
import { setupPopups } from "./UI/Popups";
import Vector2 from "./UI/Vector2";
import { UNDO_SINGLETON } from "./Undo";
import { GraphElement } from "./UI/GraphElement";
import { Simulator } from "./core/Main";
import { FunctionTable } from "./core/FunctionTable";
import Expression from "./expr/Expression";
import { OutputTable } from "./core/OutputTable";

enum State {
  Paused,
  Running,
  Stopped,
}

/**
 * represents the lifecycle of the application and when certain code should be called.
 */
export class Lifecycle {
  /**
   * Resolves once the setup function has been called.
   */
  public setupCompleted: Promise<void> = new Promise((resolve, _reject) => {
    this.resolveSetupCompleted = resolve;
  });

  /**
   * Resolves the setupCompleted promise. Should never be accessed outside of the setup function.
   */
  private resolveSetupCompleted!: (value: void | PromiseLike<void>) => void;

  @queryAll(".placed-component")
  private placedComponents!: NodeListOf<DraggableComponentElement>;

  @query("#import-button")
  import_button!: HTMLButtonElement

  @query("#export-button")
  export_button!: HTMLButtonElement

  @query("#clear-button")
  clear_button!: HTMLButtonElement

  @query("#run-button")
  run_button!: HTMLButtonElement

  @query("#stop-button")
  stop_button!: HTMLButtonElement

  @query("#pause-button")
  pause_button!: HTMLButtonElement

  @query("#unpause-button")
  unpause_button!: HTMLButtonElement

  @query("#config-file-upload")
  config_file_input!: HTMLInputElement;

  @query("#simulation-step-period")
  step_period_input!: HTMLInputElement;

  @query("#motor-speed")
  motor_speed_input!: HTMLInputElement;

  @query("#content")
  content!: HTMLElement;

  @query("#machine")
  machine!: HTMLElement;

  state: State = State.Stopped;

  private _on_frame: undefined | ((delta: number) => void);

  /**
   * Sets up the internal lifecycle state
   */
  constructor() {
    // Make sure to run initialLoad after setup
    this.setupCompleted.then(() => this.initialLoad());
  }

  /**
   * A function that is only called once, on window load. It should never be called again.
   * Only callbacks and other such stateful objects should exist in this function.
   */
  public setup(): void {
    // Drag and drop functionality
    setupDragHooks();

    // Popups on right click
    setupPopups();

    // Screen Dragging
    setupScreenHooks();

    // Add event listener for when anywhere on the screen is clicked to clear selected item
    setupSelectHooks();

    // Setup click event listener
    this.import_button.addEventListener("click", _ => this._handle_import_file());
    this.export_button.addEventListener("click", _ => this._handle_export_file());
    this.clear_button.addEventListener("click", _ => this._clear_components());

    this.run_button.addEventListener("click", _ => this.run());
    this.stop_button.addEventListener("click", _ => this.stop());
    this.pause_button.addEventListener("click", _ => this.pause());
    this.unpause_button.addEventListener("click", _ => this.unpause());

    window.addEventListener("keydown", e => {
      if (e.defaultPrevented) {
        return;
      }

      this._handle_keydown(e);
    }, true);

    let last_frame = 0;

    const frame = (elapsed: number) => {
      window.requestAnimationFrame(frame);

      const delta = (elapsed - last_frame) / 1000.0;
      last_frame = elapsed;
      this._frame(delta);
    };
    window.requestAnimationFrame(frame);

    // KEEP THIS AT THE END OF THIS FUNCTION.
    this.resolveSetupCompleted();
  }

  private _handle_keydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Z':
      case 'z':
        if (e.ctrlKey) {
          if (e.shiftKey) {
            UNDO_SINGLETON.pop_future();
          } else {
            UNDO_SINGLETON.pop_history();
          }
          e.preventDefault();
        }
        break;
      case 'S':
      case 's':
        if (e.ctrlKey) {
          this._handle_export_file();
          e.preventDefault();
        }
        break;
    }
  }

  /**
   * Called immediately after setup. The program should still function perfrectly if this
   * is never run.
   */
  public initialLoad(): void {
    this.loadState(INTEGRATING_LINEAR);
    UNDO_SINGLETON.remove();
  }

  /**
   * A function called whenever a new configuration is loaded, whether that is from disk
   * or an example program.
   */
  public loadState(config: Config): void {
    UNDO_SINGLETON.push();

    // Remove any components placed in the scene.
    this._clear_components();

    // Reset screen dragging offset 
    resetScreenOffset();

    loadConfig(config);

    if (this.placedComponents.length > 0) {
      let top = Number.POSITIVE_INFINITY;
      let left = Number.POSITIVE_INFINITY;
      let bottom = Number.NEGATIVE_INFINITY;
      let right = Number.NEGATIVE_INFINITY;

      for (let component of this.placedComponents) {
        top = Math.min(top, component.top);
        left = Math.min(left, component.left);
        bottom = Math.max(bottom, component.top + component.height);
        right = Math.max(right, component.left + component.width);
      }

      let x = this.machine.offsetWidth / 2 - GRID_SIZE * (left + right) / 2;
      let y = this.machine.offsetHeight / 2 - GRID_SIZE * (top + bottom) / 2;

      setScreenOffset(new Vector2(x, y));
    }
  }

  public exportState(): Config {
    return toConfig();
  }

  private _clear_components(): void {
    for (let component of this.placedComponents) {
      let { top, left, width, height } = component;
      component.remove();
      setCells({ x: left, y: top }, { x: width, y: height }, false);
    }
  }

  private _handle_export_file(): void {
    let config = this.exportState();

    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(config)], { type: "application/json" });

    link.href = URL.createObjectURL(file);
    link.download = "differential-analyzer.json";
    link.click();

    URL.revokeObjectURL(link.href);
  }

  private _handle_import_file(): void {
    let file = this.config_file_input.files?.[0];
    if (file === null || file === undefined) {
      return;
    }

    let reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = e => {
      let content = e.target?.result;
      if (content === null || content == undefined) {
        return;
      }

      let config = JSON.parse(content.toString()) as Config;
      this.loadState(config);
    }
  }

  stop(): void {
    this.state = State.Stopped;

    this.step_period_input.disabled = false;
    this.import_button.disabled = false;
    this.clear_button.disabled = false;

    this.run_button.hidden = false;
    this.stop_button.hidden = true;
    this.pause_button.hidden = true;
    this.unpause_button.hidden = true;
  }

  pause(): void {
    if (this.state !== State.Running) {
      console.warn(`Tried to pause application when it was not running.\nState was ${this.state}`);
      return;
    }
    this.state = State.Paused;

    this.run_button.hidden = true;
    this.stop_button.hidden = false;
    this.pause_button.hidden = true;
    this.unpause_button.hidden = false;
  }

  unpause(): void {
    if (this.state !== State.Paused) {
      console.warn(`Tried to unpause application when it was not paused.\nState was ${this.state}`);
    }
    this.state = State.Running;

    this.run_button.hidden = true;
    this.stop_button.hidden = true;
    this.pause_button.hidden = false;
    this.unpause_button.hidden = true;
  }

  run(): void {
    if (this.state !== State.Stopped) {
      console.warn(`Tried to run application when it was not stopped.\nState was ${this.state}`);
    }
    this.state = State.Running;

    this.step_period_input.disabled = true;
    this.import_button.disabled = true;
    this.clear_button.disabled = true;

    this.run_button.hidden = true;
    this.stop_button.hidden = true;
    this.pause_button.hidden = false;
    this.unpause_button.hidden = true;

    const simulator = new Simulator(this.exportState())
    const step_period = Number(this.step_period_input.value);
    const get_motor_speed = () => Number(this.motor_speed_input.value);

    const output_tables = document.querySelectorAll(".outputTable > graph-table")! as NodeListOf<GraphElement>;
    // const function_tables = document.querySelectorAll(".functionTable > graph-table")! as NodeListOf<GraphElement>;

    simulator.components.filter(x => x instanceof FunctionTable).forEach((x: FunctionTable) => {
      const function_table_element = document.querySelector(`#component-${x.id} > graph-table`) as GraphElement;

      let compiled_expr = Expression.compile(function_table_element.data_sets["d1"]?.fn ?? "");
      x.fun = x => compiled_expr({ x });
      x.x_position = function_table_element.x_min;
    });

    output_tables.forEach(x => {
      x.set_data_set("d1", []);
      x.set_data_set("d2", [], "red", true);
    })

    simulator.components.filter(x => x instanceof OutputTable).forEach((x: OutputTable) => {
      const output_table_element = document.querySelector(`#component-${x.id} > graph-table`) as GraphElement;

      console.log(x.id);
      x.xHistory[0] += output_table_element.x_min;
    });

    let elapsed = 0;
    let steps_taken = 0;

    this._on_frame = (delta: number) => {
      elapsed += delta;

      const next_steps = Math.floor(elapsed / step_period);

      simulator.motor?.changeRotation(get_motor_speed() * step_period);

      for (; steps_taken < next_steps; steps_taken++) {
        simulator.step();
      }

      for (let out of simulator.outputTables) {
        let x = out.xHistory;
        let y1 = out.y1History;
        let y2 = out.y2History;

        const output_table = document.querySelector(`#component-${out.id} > graph-table`)! as GraphElement;

        output_table.mutate_data_set("d1", points => {
          for (let i = points.length; i < x.length; i++) {
            points.push(new Vector2(x[i], y1[i]));
          }
        });

        if (y2 !== undefined) {
          output_table.mutate_data_set("d2", points => {
            for (let i = points.length; i < x.length; i++) {
              points.push(new Vector2(x[i], y2[i]));
            }
          });
        }

        output_table.gantry_x = x[next_steps - 1];

        if (next_steps != 0 && x[steps_taken - 1] >= output_table.x_max) {
          this.pause();
          this.stop();
          return
        }
      }

      for (let comp of simulator.components.filter(x => x instanceof FunctionTable)) {
        const table = document.querySelector(`#component-${comp.id} > graph-table`)! as GraphElement;
        table.gantry_x = comp.x_position;
        if (next_steps !== 0 && comp.x_position >= table.x_max) {
          this.pause();
          this.stop();
          return;
        }
      }
    };
  }

  private _frame(delta: number): void {
    if (this.state !== State.Running) {
      return;
    }

    if (this._on_frame !== undefined) {
      this._on_frame(delta);
    }
  }
}
