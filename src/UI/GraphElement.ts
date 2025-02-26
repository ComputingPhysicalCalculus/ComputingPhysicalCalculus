import { css, html, LitElement, PropertyValues, unsafeCSS, svg } from "lit";
import { customElement, property, query, queryAsync } from "lit/decorators.js";

import styles from "../../styles/GraphElement.css?inline";
import Vector2 from "./Vector2";

const SQRT_3_2 = Math.sqrt(3) / 2;

@customElement("graph-table")
export class GraphElement extends LitElement {
    static styles = css`${unsafeCSS(styles)}`;

    @query("#graph")
    _canvas_graph!: HTMLCanvasElement;

    @query("#axis")
    _canvas_axis!: HTMLCanvasElement;

    @queryAsync("canvas")
    _canvasPromise!: Promise<HTMLCanvasElement>;

    @property({ attribute: "x-min", type: Number })
    x_min: number = 0;

    @property({ attribute: "x-max", type: Number })
    x_max: number = 0;

    @property({ attribute: "y-min", type: Number })
    y_min: number = 0;

    @property({ attribute: "y-max", type: Number })
    y_max: number = 0;

    @property({ attribute: "gantry-x", type: Number })
    gantry_x?: number;

    @property({ type: Number })
    padding: number = 10;

    @property({ type: Boolean })
    isAnOutput: boolean = false;

    visible: boolean = false;

    data_sets: {
        [key: string]: {
            points: Vector2[];
            style: string;
            invert_head: boolean;
            fn?: string;
        }
    } = {};

    connectedCallback() {
        super.connectedCallback();

        let resize_debouncer = true;
        let resize_observer = new ResizeObserver(_ => {
            this._canvas_axis.width = this.offsetWidth;
            this._canvas_axis.height = this.offsetHeight;

            this._draw_axis();

            if (!resize_debouncer) {
                return;
            }
            resize_debouncer = false;
            window.setTimeout(() => {
                this._canvas_graph.width = this.offsetWidth;
                this._canvas_graph.height = this.offsetHeight;
                this._draw_graph();
                resize_debouncer = true;
            }, 200);
        });
        resize_observer.observe(this);

        let entries: IntersectionObserverEntry[] = [];
        let intersection_debouncer = true;
        let intersection_observer = new IntersectionObserver(e => {
            const [root] = e;
            if (!root) {
                return;
            }

            this.visible = root.isIntersecting;
            this._draw_axis();

            entries = e;
            if (!intersection_debouncer) {
                return;
            }
            intersection_debouncer = false;

            let timeout_callback = () => {
                if (entries.length > 0) {
                    this._draw_graph();
                    entries = [];
                    window.setTimeout(timeout_callback, 200);
                } else {
                    intersection_debouncer = true;
                }
            };

            timeout_callback();
            window.setTimeout(timeout_callback, 200);
        });
        intersection_observer.observe(this);
    }

    map_x_graph_to_screen(x: number): number {
        return (x - this.x_min) / (this.x_max - this.x_min) * (this.offsetWidth - this.padding * 2) + this.padding;
    }

    map_y_graph_to_screen(y: number): number {
        return this.offsetHeight - this.padding - (y - this.y_min) / (this.y_max - this.y_min) * (this.offsetHeight - this.padding * 2);
    }

    set_data_set(key: string, points: { x: number, y: number }[], style: string = "blue", invert_head: boolean = false) {
        this.data_sets[key] = { points, style, invert_head };
        this.requestUpdate();
    }

    mutate_data_set(key: string, callback: (points: Vector2[]) => void, complete_redraw: boolean = false): boolean {
        if (!(key in this.data_sets)) {
            return false;
        }

        let points_length = this.data_sets[key].points.length;

        callback(this.data_sets[key].points);

        this._draw_graph(complete_redraw ? 0 : points_length);
        return true;
    }

    protected updated(changedProperties: PropertyValues): void {
        this._draw_axis();
        for (let prop of changedProperties.keys()) {
            switch (prop) {
                case "x_min":
                case "x_max":
                case "y_min":
                case "y_max":
                    this._draw_graph();
                    break;
            }
        }
    }

    render() {
        let content = svg``;
        if (!this.isAnOutput) {
            content = svg`
        <polygon points=" 118 191
                          126 191
                          126 188
                          131 193
                          126 198
                          126 195
                          118 195"
                          fill="black" stroke="white" strokewidth="0.5"/>
        <polygon points=" 173 184
                          173 192
                          170 192
                          175 198
                          180 192
                          177 192
                          177 184"
                          fill="blue" stroke="white" strokewidth="0.5"/>
      `;
        } else {
            content = svg`
        <polygon points=" 68 191
                          76 191
                          76 188
                          81 193
                          76 198
                          76 195
                          68 195"
                          fill="black" stroke="white" strokewidth="0.5"/>
        <polygon points=" 122 198
                          122 190
                          119 190
                          124 184
                          129 190
                          126 190
                          126 198"
                          fill="blue" stroke="white" strokewidth="0.5"/>
        <polygon points=" 172 198
                          172 190
                          169 190
                          174 184
                          179 190
                          176 190
                          176 198"
                          fill="red" stroke="white" strokewidth="0.5"/>
      `;
        }
        return html`
            <svg
                xmlns="https://www.w3.org/2000/svg"
                width="200" height="200"
                viewBox="0 0 200 200"
                style="width:100%;height:100%;position:absolute;z-index:5" 
                >
                ${content}
            </svg>
            <canvas style="position:absolute;left:0;top:0;width:100%;height:100%" id="graph"></canvas>
            <canvas style="position:absolute;left:0;top:0;width:100%;height:100%" id="axis"></canvas>
        `;
    }

    private _draw_graph(start_index: number = 0) {
        if (!this.visible) {
            return;
        }

        let ctx = this._canvas_graph.getContext("2d");
        if (ctx === null) {
            console.log("Failed to get canvas 2d context");
            return;
        }

        if (start_index === 0) {
            ctx.clearRect(0, 0, this._canvas_graph.width, this._canvas_graph.height);
        }

        ctx.lineWidth = 1;
        for (let data of Object.values(this.data_sets)) {

            ctx.strokeStyle = data.style;
            this._draw_points(ctx, data.points, start_index);
        }
    }

    private _draw_axis() {
        let ctx = this._canvas_axis.getContext("2d");
        if (ctx === null) {
            console.log("Failed to get canvas 2d context");
            return;
        }

        ctx.clearRect(0, 0, this._canvas_axis.width, this._canvas_axis.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        // X axis
        ctx.beginPath();

        let y = this._canvas_axis.height - this.padding;
        if (this.y_max < 0.0) {
            y = this.padding;
        } else if (this.y_min < 0.0) {
            y += this.y_min / (this.y_max - this.y_min)
                * (this._canvas_axis.height - this.padding * 2);
        }

        // Bottom left with padding
        ctx.moveTo(this.padding, y);

        // Bottom right with padding
        ctx.lineTo(this._canvas_axis.width - this.padding, y);

        ctx.stroke();

        // Y axis
        ctx.beginPath();

        let x = this.padding;
        if (this.x_max < 0.0) {
            x = this._canvas_axis.width - this.padding;
        } else if (this.x_min < 0.0) {
            x = this.padding - this.x_min / (this.x_max - this.x_min)
                * (this._canvas_axis.width - this.padding * 2);
        }

        // Bottom left with  padding
        ctx.moveTo(x, this._canvas_axis.height - this.padding);

        // Top Left with padding
        ctx.lineTo(x, this.padding);

        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        this._draw_gantry_shaft(ctx);


        for (let data of Object.values(this.data_sets)) {
            if (this.gantry_x === undefined) {
                continue;
            }

            let { x, y } = data.points[data.points.length - 1] ?? { x: 0, y: 0 };
            let last_x = x, last_y = y;
            for (let i = data.points.length; i > 0; i--) {
                let point = data.points[i - 1];
                x = point.x;
                y = point.y;
                if (x <= this.gantry_x) {
                    break;
                }

                last_x = x;
                last_y = y;
            }

            // linearly interpolate between y and last_y
            // with t value being (this.gantry_x - x) / (last_x - x)
            if (last_x - x !== 0) {
                y = y + (last_y - y) * (this.gantry_x - x) / (last_x - x);
            }

            ctx.fillStyle = data.style;
            this._draw_gantry_head(ctx, y, data.invert_head);
        }
    }

    private _draw_gantry_shaft(ctx: CanvasRenderingContext2D) {
        if (this.gantry_x === undefined) {
            return;
        }

        // Gantry vertical bar
        ctx.beginPath();

        const gantry_x_screen = this.map_x_graph_to_screen(this.gantry_x);
        ctx.moveTo(gantry_x_screen, this._canvas_axis.height - this.padding);
        ctx.lineTo(gantry_x_screen, this.padding);

        ctx.stroke();
    }

    private _draw_points(ctx: CanvasRenderingContext2D, points: Vector2[], start_index: number = 0) {
        ctx.beginPath();
        for (let point of points.slice(Math.max(start_index - 1, 0))) {
            if (point.x < this.x_min || point.x > this.x_max) {
                continue;
            }

            let point_y = point.y;
            if (point_y < this.y_min) {
                point_y = this.y_min;
            } else if (point_y > this.y_max) {
                point_y = this.y_max;
            }

            const x = this.map_x_graph_to_screen(point.x);
            const y = this.map_y_graph_to_screen(point_y);

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    private _draw_gantry_head(ctx: CanvasRenderingContext2D, y: number, invert_side: boolean) {
        if (this.gantry_x === undefined) {
            return;
        }

        if (this.gantry_x < this.x_min || this.gantry_x > this.x_max) {
            return;
        }

        if (y < this.y_min) {
            y = this.y_min;
        } else if (y > this.y_max) {
            y = this.y_max;
        }

        const gantry_x_screen = this.map_x_graph_to_screen(this.gantry_x);
        let gantry_y_screen = this.map_y_graph_to_screen(y);

        let side_mult = invert_side ? -1.0 : 1.0;

        ctx.beginPath();

        const side_length = 10;
        const width = side_length * SQRT_3_2;

        ctx.moveTo(gantry_x_screen, gantry_y_screen);
        ctx.lineTo(gantry_x_screen + side_mult * width, gantry_y_screen + side_length / 2);
        ctx.lineTo(gantry_x_screen + side_mult * width, gantry_y_screen - side_length / 2);

        ctx.fill();
    }
}


