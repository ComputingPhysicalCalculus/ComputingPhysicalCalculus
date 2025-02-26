import Expression from "@src/expr/Expression";
import { html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("custom-variables")
export class CustomVariablesElement extends LitElement {
  private expression: string = "";

  private values: { [k: string]: number } = {};

  @query("textarea")
  private _textarea!: HTMLTextAreaElement;

  getValues(): { [k: string]: number } {
    return this.values;
  }

  getText(): string {
    return this._textarea.value;
  }

  setText(text: string): void {
    this._textarea.value = text;
  }

  change() {
    this._textarea.style.height = "auto";
    this._textarea.style.height = this._textarea.scrollHeight + "px";

    this.expression = this._textarea.value;
    if (this.expression.trim() === "") {
      this.values = {};
      return;
    }

    let parsed_expression = Expression.parse(this.expression);

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
      parsed_expression = parsed_expression.cons;
    } while (parsed_expression._type === "let");
  }

  render() {
    // Gets new value in change
    const delayed_change = () => window.setTimeout(() => this.change(), 0);

    return html`
      <div style="display:flex;width:100%">
        <textarea style="flex:1 1 auto;overflow:hidden;resize:none;padding:0" type="text" rows="10"
          @change=${delayed_change}
          @cut=${delayed_change}
          @paste=${delayed_change}
          @drop=${delayed_change}
          @keydown=${delayed_change}
          @input=${delayed_change}
        ></textarea>
      </div>
    `;
  }
};
