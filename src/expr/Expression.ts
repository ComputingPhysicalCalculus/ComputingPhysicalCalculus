import { BUILTIN_VARIABLES, BUITLIN_FUNCTIONS } from "./builtins";
import { ParsedExpression } from "./ParsedExpression";
import { next_token, parse_expr, Token } from "./Parser";

export default class Expression {
  static eval(expr: string, ctx: { [ident: string]: number } = {}): number {
    return this.eval_expr(this.parse(expr), ctx);
  }

  static compile(expr: string): (ctx?: { [ident: string]: number }) => number {
    let parsed_expr = this.parse(expr);

    return (ctx: { [ident: string]: number } = {}) => {
      return this.eval_expr(parsed_expr, ctx);
    };
  }

  static eval_expr(expr: ParsedExpression, ctx: { [ident: string]: number } = {}): number {
    ctx = {
      ...BUILTIN_VARIABLES,
      ...ctx,
    };

    switch (expr._type) {
      case "+":
      case "-":
      case "/":
      case "*":
      case "^":
        const lhs = ("left" in expr) ? this.eval_expr(expr.left, ctx) : 0;
        const rhs = this.eval_expr(expr.right, ctx);
        return BUITLIN_FUNCTIONS[expr._type].call(lhs, rhs);
      case "fn":
        if (!(expr.ident in BUITLIN_FUNCTIONS)) {
          throw new Error(`Tried to call builtin function '${expr.ident}', but it does not exist.`);
        }
        let fn = BUITLIN_FUNCTIONS[expr.ident];
        if (fn.num_params !== expr.params.length) {
          throw new Error(`Tried to call builtin function '${expr.ident}', with ${expr.params.length} parameters, but it takes ${fn.num_params}`);
        }
        return fn.call(...expr.params.map(expr => this.eval_expr(expr, ctx)));
      case "var":
        if (!(expr.ident in ctx)) {
          throw new Error(`Referenced undefined variable ${expr.ident}`);
        }
        return ctx[expr.ident];
      case "lit":
        return expr.value;
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

