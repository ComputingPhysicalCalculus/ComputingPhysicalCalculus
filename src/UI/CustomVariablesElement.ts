import Expression from "@src/expr/Expression";
import { css, unsafeCSS, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

import styles from "../../styles/CustomVariables.css?inline";

@customElement("custom-variables")
export class CustomVariablesElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  private expression: string = "";

  private values: { [k: string]: number } = {};

  @query("#input-area")
  private _textarea!: HTMLTextAreaElement;

  @query("#output-area")
  private _outputs!: HTMLTextAreaElement;

  getValues(): { [k: string]: number } {
    return this.values;
  }

  getText(): string {
    return this._textarea.value;
  }

  setText(text: string): void {
    this.values = {};
    this._textarea.value = text;
    this.change();
  }

  change() {
    this._textarea.style.height = `calc(min(${this._textarea.scrollHeight}px, 40vh))`;

    this.expression = this._textarea.value;
    if (this.expression.trim() === "") {
      this.values = {};
      return;
    }

    let parsed_expression = Expression.parse(this.expression);

    console.log(parsed_expression);

    this._outputs.value = "";

    do {
      if (parsed_expression._type !== "let") {
        const [result, vars] = Expression.partial_eval_expr(parsed_expression, this.values)
        if (result._type !== "lit") {
          throw new Error(`Referenced undefined variables: ${Array.from(vars).map(v => `'${v}'`).join(", ")}`);
        }
        break;
      }

      const [result, vars] = Expression.partial_eval_expr(parsed_expression.value, this.values);
      if (result._type !== "lit") {
        throw new Error(`Referenced undefined variables: ${Array.from(vars).map(v => `'${v}'`).join(", ")}`);
      }

      this.values[parsed_expression.ident] = result.value;
      this._outputs.value += `${parsed_expression.ident}: ${result.value.toPrecision(8)}\n`;
      parsed_expression = parsed_expression.cons;
    } while (parsed_expression._type === "let");
  }

  hover(e: MouseEvent): void {
    const hover = (e.currentTarget! as HTMLDivElement).querySelector("span")! as HTMLSpanElement;

    hover.style.left = `${e.clientX}px`;
    hover.style.top = `${e.clientY}px`;

  }

  render() {
    // Gets new value in change
    const delayed_change = () => window.setTimeout(() => this.change(), 0);

    return html`
      <div style="display:flex;width:100%;gap: var(--gap-size);">
        <div class="tooltip right" style="display: flex; width: 100%">
          <textarea id="input-area" type="text" rows="10"
          @change=${delayed_change}
          @cut=${delayed_change}
          @paste=${delayed_change}
          @drop=${delayed_change}
          @keydown=${delayed_change}
          @input=${delayed_change}>
          </textarea>
          <span class="tooltiptext">Global variables</span>
        </div>
        <div class="tooltip right" style="display: flex; width: 100%">
          <textarea id="output-area" type="text" rows="10" readonly disabled></textarea>
          <span class="tooltiptext">Evaluated Expressions</span>
        </div>
      </div>
    `;
  }
};
