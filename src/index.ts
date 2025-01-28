import { InputGraph, OutputGraph } from "./Graph";
import Vector2 from "./Vector2";

let canvasElement: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D;
let graph: OutputGraph;
let input_graph: InputGraph;

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

    graph = new OutputGraph(0, 0, canvasElement.width, canvasElement.height / 2, "", 0, Math.PI * 4, "", -2.0, 2.0);
    input_graph = new InputGraph(0, canvasElement.height / 2, canvasElement.width, canvasElement.height / 2, "", 0, Math.PI * 4, "", -2.0, 2.0);

    let generator_exp_fn  = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, 0.1 * Math.exp(i / Math.PI / 1.5));
        }
    };

    let generator_sin_fn = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, Math.sin(i / Math.PI * 16));
        }
        
    }

    let generator_exp = generator_exp_fn(1000, graph.x_axis_min, graph.x_axis_max);
    let generator_sin = generator_sin_fn(1000, graph.x_axis_min, graph.x_axis_max);
    let generator_sin_2 = generator_sin_fn(1000, graph.x_axis_min, graph.x_axis_max);

    input_graph.points.push(...generator_sin_2);

    window.setInterval(() => {
        let sample_a = generator_exp.next();
        let sample_b = generator_sin.next();

        if (sample_a.done || sample_b.done) {
            return;
        }

        graph.points_a.push(sample_a.value);
        graph.points_b.push(new Vector2(sample_a.value.x, sample_b.value.y * sample_a.value.y));
        graph.update_gantry_x();

        input_graph.set_gantry_point(graph.points_a.length);
        
        draw();
    }, 1.0 / 60.0);
}

function resize(): void {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    graph.width = canvasElement.width;
    graph.height = canvasElement.height;

    draw();
}

function draw(): void {
    graph.draw(canvasCtx);
    input_graph.draw(canvasCtx);
}
