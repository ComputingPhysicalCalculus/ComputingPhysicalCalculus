import { Config, loadConfig } from "./config";
import { OutputTable } from "./core/OutputTable";
import { query, queryAll } from "./decorators";
import { INTEGRATING_LINEAR } from "./examples";
import { export_simulator, run } from "./run";
import { ComponentType, createComponent } from "./UI/Components";
import { setupDragHooks } from "./UI/Drag";
import { DraggableComponentElement } from "./UI/DraggableElement";
import { GraphElement } from "./UI/GraphElement";
import { GRID_SIZE, resetScreenOffset, setCells, setScreenOffset, setupScreenDrag } from "./UI/Grid";
import { setupPopups } from "./UI/Popups";
import Vector2 from "./UI/Vector2";

const MAX_HISTORY_LENGTH = 32;

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

  private history: {
    _type: ComponentType,
    data: any,
  }[][] = [];

  private future: {
    _type: ComponentType,
    data: any,
  }[][] = [];

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
    setupScreenDrag();

    // Setup click event listener
    this.import_button.addEventListener("click", _ => this._handle_import_file());
    this.export_button.addEventListener("click", _ => this._handle_export_file());
    this.clear_button.addEventListener("click", _ => this._clear_components());
    this.run_button.addEventListener("click", _ => this._run_simulator());

    window.addEventListener("keydown", e => {
      if (e.defaultPrevented) {
        return;
      }

      switch (e.key) {
        case 'Z':
        case 'z':
          e.preventDefault();
          if (e.ctrlKey) {
            if (e.shiftKey) {
              this.popFuture();
            } else {
              this.popHistory();
            }
          }
          break;
        case 'S':
        case 's':
          e.preventDefault();
          this._handle_export_file();
          break;
      }
    }, true);

    // KEEP THIS AT THE END OF THIS FUNCTION.
    this.resolveSetupCompleted();
  }

  /**
   * Called immediately after setup. The program should still function perfrectly if this
   * is never run.
   */
  public initialLoad(): void {
    this.loadState(INTEGRATING_LINEAR);
    this.history.pop();
  }

  /**
   * A function called whenever a new configuration is loaded, whether that is from disk
   * or an example program.
   */
  public loadState(config: Config): void {
    this.pushHistory();

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
    return INTEGRATING_LINEAR;
  }

  public pushHistory(): void {
    // Clear future
    this.future.splice(0, this.future.length);

    // Add to history
    this._pushHistory();
  }

  private _pushHistory(): void {
    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    // Append to history, truncating it if it is too long
    this.history.splice(0, Math.max(this.history.length - MAX_HISTORY_LENGTH, 0));
    this.history.push(saved_data);
  }

  public popHistory(): void {
    if (this.history.length < 1) {
      return;
    }

    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    this.future.push(saved_data);

    // Remove current components
    this._clear_components();

    // Restore state
    let newNodes = this.history.pop()!;
    for (let node of newNodes) {
      let component = createComponent(node._type);
      component.import(node.data)

      this.content.appendChild(component);
    }
  }

  public popFuture(): void {
    if (this.future.length < 1) {
      return;
    }

    // Copy nodes
    let saved_data = [];
    for (let node of this.placedComponents) {
      saved_data.push(node.export());
    }

    this.history.push(saved_data);

    // Remove current components
    this._clear_components();

    // Restore state
    let newNodes = this.future.pop()!;
    for (let node of newNodes) {
      let component = createComponent(node._type);
      component.import(node.data)

      this.content.appendChild(component);
    }
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

  private _run_simulator(): void {
    this.run_button.disabled = true;
    this.step_period_input.disabled = true;
    this.import_button.disabled = true;
    
    const step_period = Number(this.step_period_input.value);
    const get_motor_speed = () => Number(this.motor_speed_input.value);

    const simulator = export_simulator(this.exportState(), get_motor_speed());

    const output_table = document.querySelector(".outputTable > graph-table")! as GraphElement;
    const function_table = document.querySelector(".functionTable > graph-table")! as GraphElement;

    output_table.set_data_set("a", []);
    output_table.set_data_set("b", [], "red", true);

    let resolve_simulation_finished: (value: void | PromiseLike<void>) => void;
    let simulation_finished_promise = new Promise<void>((resolve) => {
      resolve_simulation_finished = resolve;
    });
    let start: number;
    let steps_taken = 0;
    let quit = false;

    this.clear_button.addEventListener("click", _e => {
      quit = true;
    });

    function frame(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = (timestamp - start) / 1000;
      const next_steps = Math.floor(elapsed / step_period);

      simulator.motor?.changeRotation(get_motor_speed());

      for (steps_taken; steps_taken < next_steps; steps_taken++) {
        simulator.step();
      }

      let x = simulator.outputTables[0].xHistory;
      let y1 =  simulator.outputTables[0].y1History;
      let y2 =  simulator.outputTables[0].y2History!;

      output_table.mutate_data_set("a", points => {
        for (let i = points.length; i < x.length; i++) {
          points.push(new Vector2(x[i], y1[i]));
        }
      });

      output_table.mutate_data_set("b", points => {
        for (let i = points.length; i < x.length; i++) {
          points.push(new Vector2(x[i], (y2[i] - 1) / 2));
        }
      });

      output_table.gantry_x = x[next_steps - 1];
      function_table.gantry_x = x[next_steps - 1];

      if (!quit && (next_steps == 0 || x[next_steps - 1] < output_table.x_max)) {
        window.requestAnimationFrame(frame);
      } else {
        resolve_simulation_finished();
      }
    }

    window.requestAnimationFrame(frame);

    simulation_finished_promise.then(() => {
      this.run_button.disabled = false;
      this.step_period_input.disabled = false;
      this.import_button.disabled = false;
    });
  }
}
