import Graph from "./Graph";
import Vector2 from "./Vector2";

let canvasElement: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D;
let graph: Graph;

window.onload = setup;
window.onresize = resize;

function setup(): void {
    canvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    
    canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
    if (canvasCtx === null) {
        return;
    }

    graph = new Graph(0, 0, canvasElement.width, canvasElement.height, "", 0
        -0.5, 2.0, "", -5.0, 3.0);

    let generator_exp = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, Math.exp(i));
        }
    };

    let generator_log = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, Math.log(i));
        }
    };

    graph.points_a.push(...generator_exp(200, graph.x_axis_min, graph.x_axis_max));
    graph.points_b.push(...generator_log(200, graph.x_axis_min, graph.x_axis_max));

    draw()
}

function resize(): void {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    graph.width = canvasElement.width;
    graph.height = canvasElement.height;

    draw()
}

function draw(): void {
    
    graph.draw(canvasCtx);
}
