import Vector2 from "./Vector2";

export default class Graph {
  left: number;
  top: number;
  width: number;
  height: number;

  x_axis_min: number;
  x_axis_max: number;
  y_axis_min: number;
  y_axis_max: number;

  x_axis_label: string;
  y_axis_label: string;

  padding: number;

  points_a: Vector2[];
  points_b: Vector2[];

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
    this.padding = 20;
    this.points_a = [];
    this.points_b = [];
  }

  drawableWidth(): number {
    return this.width - 2 * this.padding;
  }

  drawableHeight(): number {
    return this.height - 2 * this.padding;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(this.left, this.top, this.width, this.height);

    ctx.strokeStyle = "black";
      this.draw_x_axis(ctx);
    this.draw_y_axis(ctx);

    ctx.strokeStyle = "blue";
    this.draw_points(ctx, this.points_a);

    ctx.strokeStyle = "red";
    this.draw_points(ctx, this.points_b);
  }

  draw_x_axis(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    let y = this.top + this.height - this.padding;
    if (this.y_axis_max < 0.0) {
      y = this.top + this.padding;
    } else if (this.y_axis_min < 0.0) {
      y +=  this.y_axis_min / (this.y_axis_max - this.y_axis_min) * this.drawableHeight();
    }


    // Bottom left with padding
    ctx.moveTo(this.left + this.padding, y);

    // Bottom right with padding
    ctx.lineTo(this.left + this.width - this.padding, y);

    ctx.stroke();
  }

  draw_y_axis(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    let x = this.left + this.padding;
    if (this.x_axis_max < 0.0) {
      x = this.left + this.width - this.padding;
    } else if (this.x_axis_min < 0.0) {
      x = this.left - this.x_axis_min / (this.x_axis_max - this.x_axis_min) * this.drawableWidth();
    }

    // Bottom left with  padding
    ctx.moveTo(x, this.top + this.height - this.padding);

    // Top Left with padding
    ctx.lineTo(x, this.top + this.padding);

    ctx.stroke();
  }

  draw_points(ctx: CanvasRenderingContext2D, points: Vector2[]) {
    ctx.beginPath();
    for (let point of points) {
      if (point.x < this.x_axis_min || point.x > this.x_axis_max || point.y < this.y_axis_min || point.y > this.y_axis_max) {
        continue;
      }

      const x = (point.x - this.x_axis_min) / (this.x_axis_max - this.x_axis_min) * this.drawableWidth() + this.left + this.padding;
      const y = this.top + this.height - this.padding - (point.y - this.y_axis_min) / (this.y_axis_max - this.y_axis_min) * this.drawableHeight();

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
