import Drawable from "./Drawable";
import Vector2 from "./Vector2";

const SQRT_3_2 = Math.sqrt(3) / 2;

export abstract class GraphBase implements Drawable {
  public left: number;
  public top: number;
  public width: number;
  public height: number;

  public x_axis_min: number;
  public x_axis_max: number;
  public y_axis_min: number;
  public y_axis_max: number;

  public x_axis_label: string;
  public y_axis_label: string;

  public padding: number;

  constructor(left: number, top: number, width: number, height: number, x_axis_label: string, x_axis_min: number, x_axis_max: number, y_axis_label: string, y_axis_min: number, y_axis_max: number) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.x_axis_label = x_axis_label;
    this.x_axis_min = x_axis_min;
    this.x_axis_max = x_axis_max;
    this.y_axis_label = y_axis_label;
    this.y_axis_min = y_axis_min;
    this.y_axis_max = y_axis_max;
    this.padding = 50;
  }

  drawable_width(): number {
    return this.width - 2 * this.padding;
  }

  drawable_height(): number {
    return this.height - 2 * this.padding;
  }

  map_x_graph_to_screen(x: number): number {
    
      return (x - this.x_axis_min) / (this.x_axis_max - this.x_axis_min) * this.drawable_width() + this.left + this.padding;
  }

  map_y_graph_to_screen(y: number): number {
      return this.top + this.height - this.padding - (y - this.y_axis_min) / (this.y_axis_max - this.y_axis_min) * this.drawable_height();
  }


  public draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(this.left, this.top, this.width, this.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this.draw_x_axis(ctx);
    this.draw_y_axis(ctx);
  }

  private draw_x_axis(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    let y = this.top + this.height - this.padding;
    if (this.y_axis_max < 0.0) {
      y = this.top + this.padding;
    } else if (this.y_axis_min < 0.0) {
      y +=  this.y_axis_min / (this.y_axis_max - this.y_axis_min) * this.drawable_height();
    }

    // Bottom left with padding
    ctx.moveTo(this.left + this.padding, y);

    // Bottom right with padding
    ctx.lineTo(this.left + this.width - this.padding, y);

    ctx.stroke();
  }

  private draw_y_axis(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    let x = this.left + this.padding;
    if (this.x_axis_max < 0.0) {
      x = this.left + this.width - this.padding;
    } else if (this.x_axis_min < 0.0) {
      x = this.left + this.padding - this.x_axis_min / (this.x_axis_max - this.x_axis_min) * this.drawable_width();
    }

    // Bottom left with  padding
    ctx.moveTo(x, this.top + this.height - this.padding);

    // Top Left with padding
    ctx.lineTo(x, this.top + this.padding);

    ctx.stroke();
  }

  public draw_points(ctx: CanvasRenderingContext2D, points: Vector2[]) {
    ctx.beginPath();
    for (let point of points) {
      if (point.x < this.x_axis_min || point.x > this.x_axis_max || point.y < this.y_axis_min || point.y > this.y_axis_max) {
        continue;
      }

      const x = this.map_x_graph_to_screen(point.x);
      const y = this.map_y_graph_to_screen(point.y);

      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

}

export class GantryGraph extends GraphBase {

  protected gantry_x: number;

  constructor(left: number, top: number, width: number, height: number, x_axis_label: string, x_axis_min: number, x_axis_max: number, y_axis_label: string, y_axis_min: number, y_axis_max: number) {
    super(left, top, width, height, x_axis_label, x_axis_min, x_axis_max, y_axis_label, y_axis_min, y_axis_max);
    this.gantry_x = this.x_axis_min;
  }

  protected draw_gantry_shaft(ctx: CanvasRenderingContext2D): void {
    // Gantry vertical bar
    ctx.beginPath();

    const gantry_x_screen = this.map_x_graph_to_screen(this.gantry_x);
    ctx.moveTo(gantry_x_screen, this.top + this.height - this.padding);
    ctx.lineTo(gantry_x_screen, this.top + this.padding);

    ctx.stroke();
  }

  protected draw_gantry_head(ctx: CanvasRenderingContext2D, y: number, side: boolean): void {

    if (this.gantry_x < this.x_axis_min || this.gantry_x > this.x_axis_max || y < this.y_axis_min || y > this.y_axis_max) {
      return;
    }
    
    const gantry_x_screen = this.map_x_graph_to_screen(this.gantry_x);
    let gantry_y_screen = this.map_y_graph_to_screen(y);

    let side_mult = side ? 1.0 : -1.0;

    ctx.beginPath();

    const side_length = 10;
    const width = side_length * SQRT_3_2;

    ctx.moveTo(gantry_x_screen, gantry_y_screen);
    ctx.lineTo(gantry_x_screen + side_mult * width, gantry_y_screen + side_length / 2);
    ctx.lineTo(gantry_x_screen + side_mult * width, gantry_y_screen - side_length / 2);

    ctx.fill();
  }
}

export class InputGraph extends GantryGraph {
  public points: Vector2[];

  private gantry_y: number

  constructor(left: number, top: number, width: number, height: number, x_axis_label: string, x_axis_min: number, x_axis_max: number, y_axis_label: string, y_axis_min: number, y_axis_max: number) {
    super(left, top, width, height, x_axis_label, x_axis_min, x_axis_max, y_axis_label, y_axis_min, y_axis_max);
    this.points = [];
    this.gantry_y = this.y_axis_min;
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    this.draw_points(ctx, this.points);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "gray";
    this.draw_gantry_shaft(ctx);

    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    this.draw_gantry_head(ctx, this.gantry_y, true);
  }

  public set_gantry_point(time: number): void {
    this.gantry_y = this.points[time].y;
    this.gantry_x = this.points[time].x;
  }
}

export class OutputGraph extends GantryGraph {
  public points_a: Vector2[];
  public points_b: Vector2[];

  constructor(left: number, top: number, width: number, height: number, x_axis_label: string, x_axis_min: number, x_axis_max: number, y_axis_label: string, y_axis_min: number, y_axis_max: number) {
    super(left, top, width, height, x_axis_label, x_axis_min, x_axis_max, y_axis_label, y_axis_min, y_axis_max);
    this.points_a = [];
    this.points_b = [];
  }

  public update_gantry_x(): void {
    const a_x = this.points_a.length > 0 ? this.points_a[this.points_a.length - 1].x : this.x_axis_min;
    const b_x = this.points_b.length > 0 ? this.points_b[this.points_b.length - 1].x : this.x_axis_min;
    this.gantry_x = Math.max(a_x, b_x);
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    this.draw_points(ctx, this.points_a);

    ctx.strokeStyle = "red";
    this.draw_points(ctx, this.points_b);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "gray";
    this.draw_gantry_shaft(ctx);

    let gantry_y_a = this.y_axis_min;
    if (this.points_a.length > 0) {
      gantry_y_a = this.points_a[this.points_a.length - 1].y;
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = "blue";
    this.draw_gantry_head(ctx, gantry_y_a, true);

    let gantry_y_b = this.y_axis_min;
    if (this.points_b.length > 0) {
      gantry_y_b = this.points_b[this.points_b.length - 1].y;
    }
    ctx.fillStyle = "red";
    this.draw_gantry_head(ctx, gantry_y_b, false);
  }
}
