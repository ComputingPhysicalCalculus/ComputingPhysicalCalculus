import { OutputGraph } from "./Graph";
import Vector2 from "./Vector2";

let canvasElement: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D;
let graph: OutputGraph;

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

    graph = new OutputGraph(0, 0, canvasElement.width, canvasElement.height, "", 0, 2.0, "", -5.0, 5.0);

    let generator_exp_fn = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, Math.exp(i) - 5.0);
        }
    };

    let generator_log_fn = function*(points: number, min: number, max: number) {
        for (let i = min; i < max; i += (max - min) / points) {
            yield new Vector2(i, Math.log(i));
        }
    };

    let generator_exp = generator_exp_fn(1000, graph.x_axis_min, graph.x_axis_max);
    let generator_log = generator_log_fn(1000, graph.x_axis_min, graph.x_axis_max);

    window.setInterval(() => {
        let sample_a = generator_exp.next();
        let sample_b = generator_log.next();

        if (sample_a.done || sample_b.done) {
            return;
        }

        graph.points_a.push(sample_a.value);
        graph.points_b.push(sample_b.value);
        graph.update_gantry_x();

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
}
