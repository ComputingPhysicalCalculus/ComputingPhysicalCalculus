export class IntegratorComponent extends HTMLElement {
  static observedAttributes = ["leg-one", "leg-two", "leg-three"];

  svg: SVGElement;
  line_one: SVGElement;
  line_two: SVGElement;
  line_three: SVGElement;

  viewbox_y: number = -10;

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: "open" });

    const t = (tag: string, attrs: { [name: string]: string } = {}, children: any[] = []) => {
      const elem = document.createElementNS("http://www.w3.org/2000/svg", tag);

      for (let [name, value] of Object.entries(attrs)) {
        elem.setAttribute(name, value);
      }

      for (let child of children) {
        elem.appendChild(child);
      }

      return elem;
    }

    this.line_one = t("line", {
      "id": "leg-one",
      "x1": "26",
      "y1": "35",
      "x2": "26",
      "y2": "5",
      "stroke": "black",
      "stroke-width": "2",
      "stroke-linecap": "round",
    });

    this.line_two = t("line", {
      "id": "leg-two",
      "x1": "50",
      "y1": "25",
      "x2": "50",
      "y2": "5",
      "stroke": "black",
      "stroke-width": "2",
      "stroke-linecap": "round",
    });
    
    this.line_three =  t("line", {
      "id": "leg-three",
      "x1": "74",
      "y1": "-3",
      "x2": "74",
      "y2": "0",
      "stroke": "black",
      "stroke-width": "2",
      "stroke-linecap": "round",
    });

    this.svg = t("svg", {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "100px",
      // "height": "70px",
      "viewBox": `0 ${this.viewbox_y} 100 ${70 - this.viewbox_y}`,
    }, [
        t("rect", {
          "x": "5",
          "y": "5",
          "width": "90",
          "height": "60",
          "fill": "none",
          "stroke": "black",
          "stroke-width": "2",
          "rx": "5",
        }),
        t("rect", {
          "x": "44",
          "y": "25",
          "width": "12",
          "height": "20",
          "fill": "none",
          "stroke": "black",
          "stroke-width": "2",
          "rx": "2",
        }),
        t("circle", {
          "cx": "26",
          "cy": "35",
          "r": "18",
          "fill": "none",
          "stroke": "black",
          "stroke-width": "2",
        }),
        t("line", {
          "x1": "18",
          "y1": "35",
          "x2": "34",
          "y2": "35",
          "stroke": "black",
          "stroke-width": "2",
          "stroke-linecap": "round",
        }),
        t("polygon", {
          "fill": "black",
          "stroke": "black",
          "stroke-width": "2",
          "stroke-linejoin": "round",
          "points": "74,4 71,-3 77,-3",
        }),
        this.line_one,
        this.line_two,
        this.line_three,
    ]);

    for (let i = 0; i < 4; i++) {
      const child = t("line", {
        "x1": "45",
        "y1": (29 + i * 5).toString(),
        "x2": "55",
        "y2": (26 + i * 5).toString(),
        "stroke": "black",
        "stroke-width": "2",
        "stroke-linecap": "round",
      });
      
      this.svg.appendChild(child);
    }

    shadow.appendChild(this.svg);
  }

  attributeChangedCallback(name: string, _old_value: string, new_value: string) {
    switch (name) {
      case "leg-one": {
        const new_length = Number.parseFloat(new_value);
        this.line_one.setAttribute("y2", (-new_length).toString());

        if (-new_length < this.viewbox_y + 5) {
          this.viewbox_y = -5 - new_length;
          this.svg.setAttribute("viewBox", `0 ${this.viewbox_y} 100 ${70 - this.viewbox_y}`);
        }
      }; break;
      case "leg-two": {
        const new_length = Number.parseFloat(new_value);
        this.line_two.setAttribute("y2", (-new_length).toString());

        if (-new_length < this.viewbox_y + 5) {
          this.viewbox_y = -5 - new_length;
          this.svg.setAttribute("viewBox", `0 ${this.viewbox_y} 100 ${70 - this.viewbox_y}`);
        }
      }; break;
      case "leg-three": {
        const new_length = Number.parseFloat(new_value);
        this.line_three.setAttribute("y2", (-new_length).toString());

        if (-new_length < this.viewbox_y + 5) {
          this.viewbox_y = -5 - new_length;
          this.svg.setAttribute("viewBox", `0 ${this.viewbox_y} 100 ${70 - this.viewbox_y}`);
        }
      }; break;
    }
  }
}

export function register(name: string = "integrator-component") {
  customElements.define(name, IntegratorComponent);
}
