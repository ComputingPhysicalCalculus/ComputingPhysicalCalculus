import { Config, loadConfig } from "./config";
import { getHShaftID, getVShaftID, toConfig } from "./GenerateConfigFromUI";
import { query, queryAll } from "./decorators";
import { SPRING_EXAMPLE, LINEAR_INTEGRATION_EXAMPLE, GAMMA_FUNCTION_EXAMPLE, WEIERSTRAUSS_FUNCTION_EXAMPLE, GEAR_PAIR_EXAMPLE, EPICYCLOID_EXAMPLE, EXTREME_EPICYCLOID_EXAMPLE, FREE_FALL_EXAMPLE, DUFFING_EQUATION_EXAMPLE, POPULATION_GROWTH_EXAMPLE, SIMPLE_PENDULUM_EXAMPLE, DOUBLE_PENDULUM_EXAMPLE } from "./examples";
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
import { DialComponentElement } from "./UI/DialComponentElement.ts";
import { CustomVariablesElement } from "./UI/CustomVariablesElement.ts";

enum State {
    Paused,
    Running,
    Stopped,
}

export function get_global_ctx(): { [k: string]: number } {
    const custom_variables = document.querySelector("custom-variables") as CustomVariablesElement;
    if (!custom_variables) return {}

    return custom_variables.getValues();
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

    @query("#demo-button")
    demo_button!: HTMLButtonElement

    @query("#examples-list")
    examples_select!: HTMLSelectElement;

    @query("#import-button")
    import_button!: HTMLButtonElement

    @query("#export-button")
    export_button!: HTMLButtonElement

    @query("#clear-button")
    clear_button!: HTMLButtonElement

    @query("#clear-tables-button")
    clear_output_tables_button!: HTMLButtonElement

    @query("#play-button")
    play_button!: HTMLButtonElement

    @query("#stop-button")
    stop_button!: HTMLButtonElement

    @query("#pause-button")
    pause_button!: HTMLButtonElement

    config_file_input!: HTMLInputElement;

    @query("#simulation-step-period")
    step_period_input!: HTMLInputElement;

    @query("#motor-speed")
    motor_speed_input!: HTMLInputElement;

    @query("#content")
    content!: HTMLElement;

    @query("#machine")
    machine!: HTMLElement;

    currently_demoing: Boolean = false;

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
        this.examples_select.addEventListener("click", e => {
            if (e.target != e.currentTarget) {
                this.change_example(e);
            }
        });

        this.config_file_input = document.createElement("input");
        this.config_file_input.accept = ".json";
        this.config_file_input.type = "file";

        this.examples_select.addEventListener("change", e => this.change_example(e));
        this.examples_select.selectedIndex = 0;
        this.demo_button.addEventListener("click", _ => this.toggle_demo());

        this.import_button.addEventListener("click", _ => this.config_file_input.click());
        this.config_file_input.addEventListener("change", _ => this._handle_import_file());
        this.export_button.addEventListener("click", _ => this._handle_export_file());
        this.clear_button.addEventListener("click", _ => this._clear_components());

        this.clear_output_tables_button.addEventListener("click", _ => {
            const output_tables = document.querySelectorAll(".outputTable > graph-table")! as NodeListOf<GraphElement>;
            output_tables.forEach(x => {
                this.reset_output_table(x);
            })
        });

        this.play_button.addEventListener("click", _ => {
            if (this.state == State.Stopped) {
                this.run();
            } else {
                this.unpause();
            }
        });
        this.stop_button.addEventListener("click", _ => {
            if (this.currently_demoing) { this.stop_demo(); } else { this.stop(); }
        });
        this.pause_button.addEventListener("click", _ => this.pause());

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
        this.loadState(LINEAR_INTEGRATION_EXAMPLE);
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
        UNDO_SINGLETON.push();
        for (let component of this.placedComponents) {
            let { top, left, width, height } = component;
            component.remove();
            setCells({ x: left, y: top }, { x: width, y: height }, false);
        }
    }

    private _handle_export_file(): void {
        let config = this.exportState();

        const link = document.createElement("a");
        const file = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });

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

    change_example(e: Event): void {
        const option = e.target as HTMLOptionElement;
        switch (option.value) {
            case "LinearIntegration": this.loadState(LINEAR_INTEGRATION_EXAMPLE); break;
            case "Spring": this.loadState(SPRING_EXAMPLE); break;;
            case "GammaFunction": this.loadState(GAMMA_FUNCTION_EXAMPLE); break;
            case "WeierstraussFunction": this.loadState(WEIERSTRAUSS_FUNCTION_EXAMPLE); break;
            case "GearPair": this.loadState(GEAR_PAIR_EXAMPLE); break;
            case "Epicycloid": this.loadState(EPICYCLOID_EXAMPLE); break;
            case "ExtremeEpicycloid": this.loadState(EXTREME_EPICYCLOID_EXAMPLE); break;
            case "Freefall": this.loadState(FREE_FALL_EXAMPLE); break;
            case "DuffingEquation": this.loadState(DUFFING_EQUATION_EXAMPLE); break;
            case "PopulationGrowth": this.loadState(POPULATION_GROWTH_EXAMPLE); break;
            case "SimplePendulum": this.loadState(SIMPLE_PENDULUM_EXAMPLE); break;
            case "DoublePendulum": this.loadState(DOUBLE_PENDULUM_EXAMPLE); break;
        }
        this.stop();
    }

    // Put the simulation into a demo mode
    stop_demo(): void {
        this.currently_demoing = false;
        this.demo_button.textContent = "Start Demo";
        this.examples_select.disabled = false;
        this.stop();
    }

    start_demo(): void {
        this.currently_demoing = true;
        this.demo_button.textContent = "Stop Demo";
        this.examples_select.disabled = true;
        this.run();
    }

    toggle_demo(): void {
        if (this.currently_demoing) {
            this.stop_demo();
        } else {
            this.start_demo();
        }
    }

    stop(): void {
        this.state = State.Stopped;

        if (this.currently_demoing) {
            this.run();
            return;
        }

        this.step_period_input.disabled = false;
        this.import_button.disabled = false;
        this.clear_button.disabled = false;

        this.play_button.disabled = false;
        this.pause_button.disabled = true;
        this.stop_button.disabled = true;
        this.clear_output_tables_button.disabled = false;
    }

    pause(): void {
        if (this.state !== State.Running) {
            console.warn(`Tried to pause application when it was not running.\nState was ${this.state}`);
            return;
        }
        this.state = State.Paused;

        this.play_button.disabled = false;
        this.pause_button.disabled = true;
        this.stop_button.disabled = false;
        this.clear_output_tables_button.disabled = true;
    }

    unpause(): void {
        if (this.state !== State.Paused) {
            console.warn(`Tried to unpause application when it was not paused.\nState was ${this.state}`);
        }
        this.state = State.Running;

        this.play_button.disabled = true;
        this.pause_button.disabled = false;
        this.stop_button.disabled = false;
        this.clear_output_tables_button.disabled = true;
    }

    run(): void {
        if (this.state !== State.Stopped) {
            console.warn(`Tried to run application when it was not stopped.\nState was ${this.state}`);
        }
        this.state = State.Running;

        this.step_period_input.disabled = true;
        this.import_button.disabled = true;
        this.clear_button.disabled = true;

        this.play_button.disabled = true;
        this.pause_button.disabled = false;
        this.stop_button.disabled = false;
        this.clear_output_tables_button.disabled = true;

        const simulator = new Simulator(this.exportState())
        const step_period = Number(this.step_period_input.value);
        const get_motor_speed = () => Number(this.motor_speed_input.value);

        const output_tables = document.querySelectorAll(".outputTable > graph-table")! as NodeListOf<GraphElement>;
        // const function_tables = document.querySelectorAll(".functionTable > graph-table")! as NodeListOf<GraphElement>;

        simulator.components.filter(x => x instanceof FunctionTable).forEach((x: FunctionTable) => {
            const function_table_element = document.querySelector(`#component-${x.id} > graph-table`) as GraphElement;

            let compiled_expr = Expression.compile(function_table_element.data_sets["d1"]?.fn ?? "", get_global_ctx());
            x.fun = x => compiled_expr({ x });
            x.x_position = 0;
        });

        simulator.outputTables.forEach(x => {
            const table = document.querySelector(`#component-${x.id} > graph-table`) as GraphElement;
            table.gantry_x = 0;
            table.data_sets = {};
            table.set_data_set("d1", []);
            if (x.y2 !== undefined) {
                table.set_data_set("d2", [], "red", true);
            }
        })

        const dials = document.querySelectorAll(".dial") as NodeListOf<DraggableComponentElement>;
        dials.forEach(dial => {
            (dial.querySelector("dial-component")! as DialComponentElement).count = 0
        })

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

            // TODO: Improve this code
            const dials = document.querySelectorAll(".dial") as NodeListOf<DraggableComponentElement>;
            for (let dial of dials) {
                const comp = dial.querySelector("dial-component")! as DialComponentElement;
                const pos = dial.getPosition();
                let shaft_id = getHShaftID(pos.x, pos.y);
                if (shaft_id == null) {
                    shaft_id = getVShaftID(pos.x, pos.y);
                }
                if (shaft_id != null) {
                    comp.count = simulator.shafts.filter(p => { return p.id == shaft_id })[0].rotation;
                }
            }

            for (let comp of simulator.components.filter(x => x instanceof FunctionTable)) {
                const table = document.querySelector(`#component-${comp.id} > graph-table`)! as GraphElement;
                table.gantry_x = comp.x_position;
                if (next_steps !== 0 && comp.x_position >= table.x_max && table.parentElement?.dataset.lookup == "0") {
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

    private reset_output_table(table: GraphElement): void {
        table.data_sets = {};
        table.gantry_x = 0;
    }
}
