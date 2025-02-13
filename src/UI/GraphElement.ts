import { css, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, queryAsync } from "lit/decorators.js";

import styles from "../../styles/GraphElement.css?inline";
import Vector2 from "./Vector2";

const SQRT_3_2 = Math.sqrt(3) / 2;

@customElement("graph-table")
export class GraphElement extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  
  @query("canvas")
  _canvas!: HTMLCanvasElement;

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

  data_sets: {
    [key: string]: {
      points: Vector2[];
      style: string;
      invert_head: boolean;
    }
  } = {};

  // Keep in this form otherwise `this` will be undefined
  private _handle_resize = () => {
    this._canvas.width = this.offsetWidth;
    this._canvas.height = this.offsetHeight;

    this._draw();
  }

  connectedCallback() {
    super.connectedCallback();

    this._canvasPromise.then(this._handle_resize);
    let resize_observer = new ResizeObserver(this._handle_resize);
    resize_observer.observe(this);
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

  mutate_data_set(key: string, callback: (points: Vector2[]) => void): boolean {
    if (!(key in this.data_sets)) {
      return false;
    }

    callback(this.data_sets[key].points);
    
    this.requestUpdate();
    return true;
  }

  protected updated(_changedProperties: PropertyValues): void {
    this._draw();
  }
  
  render() {
    return html`
      <canvas />
    `;
  }

  private _draw() {
    let ctx = this._canvas.getContext("2d");
    if (ctx === null) {
      console.log("Failed to get canvas 2d context");
      return;
    }

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this._draw_axis(ctx);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "gray";
    this._draw_gantry_shaft(ctx);

    ctx.lineWidth = 1;
    for (let data of Object.values(this.data_sets)) {
      
      ctx.strokeStyle = data.style;
      this._draw_points(ctx, data.points);

      if (this.gantry_x === undefined) {
        continue;
      }

      let last_x = 0.0, last_y = 0.0;
      let x = 0.0, y = 0.0;
      for ({ x, y } of data.points) {
        if (x >= this.gantry_x) {
          break;
        }

        last_x = x;
        last_y = y;
      }

      y = last_y + (y - last_y) * ((this.gantry_x - last_x) / (x - last_x));

      ctx.fillStyle = data.style;
      this._draw_gantry_head(ctx, y, data.invert_head);
    }
  }

  private _draw_axis(ctx: CanvasRenderingContext2D) {
    // X axis
    ctx.beginPath();

    let y = this._canvas.height - this.padding;
    if (this.y_max < 0.0) {
      y = this.padding;
    } else if (this.y_min < 0.0) {
      y +=  this.y_min / (this.y_max - this.y_min)
        * (this._canvas.height - this.padding * 2);
    }

    // Bottom left with padding
    ctx.moveTo(this.padding, y);

    // Bottom right with padding
    ctx.lineTo(this._canvas.width - this.padding, y);

    ctx.stroke();

    // Y axis
    ctx.beginPath();

    let x = this.padding;
    if (this.x_max < 0.0) {
      x = this._canvas.width - this.padding;
    } else if (this.x_min < 0.0) {
      x = this.padding - this.x_min / (this.x_max - this.x_min)
        * (this._canvas.width - this.padding * 2);
    }

    // Bottom left with  padding
    ctx.moveTo(x, this._canvas.height - this.padding);

    // Top Left with padding
    ctx.lineTo(x, this.padding);

    ctx.stroke();
  }

  private _draw_gantry_shaft(ctx: CanvasRenderingContext2D) {
    if (this.gantry_x === undefined) {
      return;
    }
    
    // Gantry vertical bar
    ctx.beginPath();

    const gantry_x_screen = this.map_x_graph_to_screen(this.gantry_x);
    ctx.moveTo(gantry_x_screen, this._canvas.height - this.padding);
    ctx.lineTo(gantry_x_screen, this.padding);

    ctx.stroke();
  }

  private _draw_points(ctx: CanvasRenderingContext2D, points: Vector2[]) {
    ctx.beginPath();
    for (let point of points) {
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


