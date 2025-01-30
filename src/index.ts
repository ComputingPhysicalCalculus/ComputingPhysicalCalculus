import { InputGraph, OutputGraph } from "./Graph";
import Vector2 from "./Vector2";

import { setupDragHooks } from "./Drag";
import { createGrid } from "./Grid";

import { register as registerIntegratorComponent } from "./IntegratorComponent.ts";

let canvasElement: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D;
let graph: OutputGraph;
let input_graph: InputGraph;

window.onload = setup;
window.onresize = resize;

function setup(): void {
    registerIntegratorComponent();

    let i = document.createElement("integrator-component");
    i.setAttribute("style", "position:absolute;left:50%;bottom:50%");
    i.setAttribute("leg-one", "80");
    i.setAttribute("leg-two", "25");
    i.setAttribute("leg-three", "60");
    document.body.appendChild(i);

    canvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
    if (canvasCtx === null) {
        return;
    }

    graph = new OutputGraph(0, 0, canvasElement.width, canvasElement.height / 2, "", 0, Math.PI * 4, "", -2.0, 2.0);
    input_graph = new InputGraph(0, canvasElement.height / 2, canvasElement.width, canvasElement.height / 2, "", 0, Math.PI * 4, "", -2.0, 2.0);

    let generator = function*(n: number, min: number, max: number, f: (x: number) => number) {
        for (let i = min; i < max; i += (max - min) / n) {
            yield new Vector2(i, f(i));
        }
    }

    let generator_exp = generator(1000, graph.x_axis_min, graph.x_axis_max, x => 0.1 * Math.exp(x / 4));
    let generator_sin = generator(1000, graph.x_axis_min, graph.x_axis_max, x => Math.sin(x * 8));
    let generator_sin_2 = generator(1000, input_graph.x_axis_min, input_graph.x_axis_max, x => Math.sin(x * 8));

    input_graph.points.push(...generator_sin_2);

    window.setInterval(() => {
        let sample_a = generator_exp.next();
        let sample_b = generator_sin.next();

        if (sample_a.done || sample_b.done) {
            return;
        }

        input_graph.set_gantry_point(graph.points_a.length);
        graph.points_a.push(sample_a.value);
        graph.points_b.push(new Vector2(sample_a.value.x, sample_b.value.y * sample_a.value.y));
        graph.update_gantry_x();


        draw();
    }, 1.0 / 60.0);

    setupDragHooks();
    createGrid();
}

function resize(): void {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    graph.width = canvasElement.width;
    graph.height = canvasElement.height / 2;

    input_graph.width = canvasElement.width;
    input_graph.height = canvasElement.height / 2;

    draw();
}

function draw(): void {
    graph.draw(canvasCtx);
    input_graph.draw(canvasCtx);
}
