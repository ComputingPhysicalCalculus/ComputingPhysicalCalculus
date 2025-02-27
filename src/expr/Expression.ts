import { BUILTIN_VARIABLES, BUITLIN_FUNCTIONS } from "./builtins";
import { ParsedExpression } from "./ParsedExpression";
import { next_token, parse_expr, Token } from "./Parser";

export default class Expression {
  static eval(expr: string, ctx: { [ident: string]: number } = {}): number {
    const [result, vars] = this.partial_eval_expr(this.parse(expr), ctx);

    if (result._type !== "lit") {
      throw new Error(`Referenced undefined variables: ${Array.from(vars).map(v => `'${v}'`).join(", ")}`);
    }

    return result.value
  }

  static compile(expr: string, ctx: { [ident: string]: number } = {}): (ctx?: { [ident: string]: number }) => number {
    const result = this.compile_min(expr, ctx);
    return (typeof result === "number") ? _ => result : result;
  }

  static compile_min(expr: string, ctx: { [ident: string]: number } = {}): number | ((ctx?: { [ident: string]: number }) => number) {
    const parsed_expr = this.parse(expr);
    const [partial_expr, _] = this.partial_eval_expr(parsed_expr, ctx);

    if (partial_expr._type === "lit") {
      return partial_expr.value;
    }

    return (ctx: { [ident: string]: number } = {}) => {
      const [result, new_vars] = this.partial_eval_expr(partial_expr, ctx);
      if (result._type !== "lit") {
        throw new Error(`Referenced undefined variables: ${Array.from(new_vars).map(v => `'${v}'`).join(", ")}`);
      }

      return result.value
    };
  }

  static partial_eval_expr(expr: ParsedExpression, ctx: { [ident: string]: number } = {}): [ParsedExpression, Set<string>] {
    ctx = {
      ...BUILTIN_VARIABLES,
      ...ctx,
    };

    switch (expr._type) {
      case "+":
      case "-":
      case "/":
      case "*":
      case "%":
      case "^":
      case ">":
      case "<":
      case ">=":
      case "<=":
      case "==":
      case "!=":
        const [lhs, lhs_vars] = ("left" in expr)
          ? this.partial_eval_expr(expr.left, ctx)
          : [{ _type: "lit", value: 0 } as ParsedExpression, new Set<string>()];

        const [rhs, rhs_vars] = this.partial_eval_expr(expr.right, ctx);

        if (lhs._type === "lit" && rhs._type === "lit") {
          return [
            { _type: "lit", value: BUITLIN_FUNCTIONS[expr._type](lhs.value, rhs.value) },
            new Set([...lhs_vars, ...rhs_vars]),
          ]
        } else {
          return [
            { _type: expr._type, left: lhs, right: rhs },
            new Set([...lhs_vars, ...rhs_vars]),
          ]
        }

      case "fn":
        if (!(expr.ident in BUITLIN_FUNCTIONS)) {
          throw new Error(`Tried to call builtin function '${expr.ident}', but it does not exist.`);
        }
        const fn = BUITLIN_FUNCTIONS[expr.ident];
        if (fn.length !== expr.params.length) {
          throw new Error(`Tried to call builtin function '${expr.ident}', with ${expr.params.length} parameters, but it takes ${fn.length}`);
        }

        const evaled_params = expr.params.map(expr => this.partial_eval_expr(expr, ctx));
        const vars = evaled_params.map(([_e, u]) => u).reduce((a, b) => new Set([...a, ...b]));
        const params = evaled_params.map(([e, _u]) => e);

        if (params.every(e => e._type === "lit")) {
          return [
            { _type: "lit", value: fn(...params.map(e => e.value)) },
            vars
          ]
        } else {
          return [
            { _type: "fn", ident: expr.ident, params },
            vars,
          ]
        }
      case "sum":
      case "prod":
        const [start_expr, start_vars] = this.partial_eval_expr(expr.start, ctx);
        const [end_expr, end_vars] = this.partial_eval_expr(expr.end, ctx);
        const [value_expr, value_vars] = this.partial_eval_expr(expr.value, ctx);
        const value_ready = value_vars.has(expr.ident) && value_vars.size == 1 || value_expr._type === "lit";
        if (start_expr._type !== "lit" || end_expr._type !== "lit" || !value_ready) {
          value_vars.delete(expr.ident)
          return [

            { _type: expr._type, ident: expr.ident, start: start_expr, end: end_expr, value: value_expr },
            new Set([...start_vars, ...end_vars, ...value_vars])
          ];
        }
        const start = start_expr.value;
        const end = end_expr.value;
        if (!Number.isInteger(start) || !Number.isInteger(end)) {
          throw new Error(`Non Integer value in range of ${expr._type === "sum" ? "summation" : "product"}`);
        }

        let step = start <= end ? 1 : -1;
        let result = expr._type === "sum" ? 0 : 1;
        for (let i = start; i != (end + step); i += step) {
          let [final_value_expr, _] = this.partial_eval_expr(value_expr, { [expr.ident]: i });
          if (final_value_expr._type !== "lit") {
            throw new Error(`Failed to fully evaluate iteration of ${expr._type === "sum" ? "summation" : "product"}. This is a bug`);
          }
          const value = final_value_expr.value;
          result = expr._type === "sum" ? (result + value) : (result * value);
        }

        return [{ _type: "lit", value: result }, new Set()];
      case "let": {
        const [value_expr, value_vars] = this.partial_eval_expr(expr.value, ctx);
        if (value_expr._type !== "lit") {
          const [cons, cons_vars] = this.partial_eval_expr(expr.cons, ctx);
          cons_vars.delete(expr.ident);
          return [
            { _type: "let", ident: expr.ident, value: value_expr, cons },
            new Set([...value_vars, ...cons_vars]),
          ];
        }
        return this.partial_eval_expr(expr.cons, { ...ctx, [expr.ident]: value_expr.value });
      }
      case "var":
        if (!(expr.ident in ctx)) {
          return [expr, new Set([expr.ident])];
        }
        return [{ _type: "lit", value: ctx[expr.ident] }, new Set()];
      case "lit":
        return [expr, new Set()];
    }
  }

  static parse(expr: string): ParsedExpression {
    const tokens: Token[] = [];
    let token: Token | null = null;

    while ([token, expr] = next_token(expr), token) {
      tokens.push(token);
    }

    return parse_expr(tokens.reverse(), 0);
  }
}

