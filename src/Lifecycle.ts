import { EXAMPLE_CONFIG } from ".";
import { Config, loadConfig } from "./config";
import { query, queryAll } from "./decorators";
import { ComponentType, createComponent } from "./UI/Components";
import { setupDragHooks } from "./UI/Drag";
import { DraggableComponentElement } from "./UI/DraggableElement";
import { setCells } from "./UI/Grid";
import { setupPopups } from "./UI/Popups";

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

  @query("#simulation-step-counter")
  step_counter_input!: HTMLInputElement;

  @query("#simulation-step-period")
  step_period_input!: HTMLInputElement;

  @query("#content")
  content!: Node;
  
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

    // Setup click event listener
    this.import_button.addEventListener("click", _ => this._handle_import_file());
    this.export_button.addEventListener("click", _ => this._handle_export_file());
    this.clear_button.addEventListener("click", _ => this._clear_components());

    window.addEventListener("keydown", e => {
      switch (e.key) {
        case 'Z':
        case 'z':
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
    })
    
    // KEEP THIS AT THE END OF THIS FUNCTION.
    this.resolveSetupCompleted();
  }

  /**
   * Called immediately after setup. The program should still function perfrectly if this
   * is never run.
   */
  public initialLoad(): void {
    this.loadState(EXAMPLE_CONFIG);
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

    loadConfig(config);
  }

  public exportState(): Config {
    return EXAMPLE_CONFIG;
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
}
