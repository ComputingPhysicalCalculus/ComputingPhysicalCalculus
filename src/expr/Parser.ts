import { BinaryOperator, ParsedExpression as ParsedExpression, UnaryOperator } from "./ParsedExpression";

export enum TokenType {
  Ident = "ident",
  Literal = "lit",
  LBracket = "(",
  RBracket = ")",
  Comma = ",",
  Add = "+",
  Sub = "-",
  Mul = "*",
  Div = "/",
  Pow = "^",
}

export type Token = {
  _type: TokenType,
  span: string,
};

const PUNCTUATION_REGEX = /^[+\-*/\^,.()]/;
const NUMBER_REGEX = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*/;

export function next_token(s: string): [Token | null, string] {
  s = s.trim();

  let regexes: { r: RegExp, _type: (match: string) => TokenType }[] = [
    { r: PUNCTUATION_REGEX, _type: match => match as TokenType, },
    { r: NUMBER_REGEX, _type: _ => TokenType.Literal },
    { r: IDENTIFIER_REGEX, _type: _ => TokenType.Ident },
  ]

  for (let { r, _type } of regexes) {
    const result = s.match(r);
    const span = result?.[0];
    if (span !== undefined) {
      return [
        { _type: _type(span), span },
        s.slice(span.length),
      ];
    }
  }

  return [null, s];
}

// Pratt Parser
// Brilliant described in: https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html

export function parse_expr(tokens: Token[], min_binding_power: number): ParsedExpression {
  let lhs_tk = tokens.pop();
  if (lhs_tk === undefined) {
    throw new Error("Empty expression encountered");
  }

  let lhs: ParsedExpression;
  switch (lhs_tk._type) {
    case TokenType.Ident:
      let peeked_tk = tokens[tokens.length - 1];
      if (peeked_tk === undefined || peeked_tk._type !== TokenType.LBracket) {
        lhs = { _type: "var", ident: lhs_tk.span };
        break;
      }

      tokens.pop();

      const params: ParsedExpression[] = [];
      outer_loop: while (true) {
        let expr = parse_expr(tokens, 0);
        params.push(expr);

        let popped_tk = tokens.pop();
        if (popped_tk === undefined) {
          throw new Error("Unclosed left bracket");
        }
        switch (popped_tk._type) {
          case ",":
            break;
          case ")":
            break outer_loop;
          default:
            throw new Error(`Unexpected token '${popped_tk.span}' of type ${popped_tk._type}`);
        }
      }

      lhs = { _type: "fn", ident: lhs_tk.span, params };
      break;
    case TokenType.Literal:
      lhs = { _type: "lit", value: Number.parseFloat(lhs_tk.span) }

      if (Number.isNaN(lhs.value)) {
        throw new Error(`Failed to parse number '${lhs.value}', this is a bug`);
      }
      break;
    case TokenType.LBracket:
      lhs = parse_expr(tokens, 0);
      let r_bracket = tokens.pop();

      if (r_bracket?._type !== TokenType.RBracket) {
        throw new Error("Unclosed left bracket");
      }
      break;

    // Unary operators
    case TokenType.Add:
    case TokenType.Sub:
      let right_binding_power = prefix_binding_power(lhs_tk._type);
      let rhs = parse_expr(tokens, right_binding_power);

      lhs = { _type: lhs_tk._type, right: rhs };
      break;
    default:
      throw new Error(`Unexpected token '${lhs_tk.span}'' of type ${lhs_tk._type}`);
  }

  outer_loop: while (true) {
    let operator = tokens[tokens.length - 1];
    if (operator === undefined) {
      break;
    }

    switch (operator._type) {
      case TokenType.Add:
      case TokenType.Sub:
      case TokenType.Mul:
      case TokenType.Div:
      case TokenType.Pow:
        break;
      case TokenType.RBracket:
      case TokenType.Comma:
        break outer_loop;
      default:
        throw new Error(`Unexpected token '${operator.span}' of type ${operator._type}`);
    }

    let [left_binding_power, right_binding_power] = infix_binding_power(operator._type as BinaryOperator);
    if (left_binding_power < min_binding_power) {
      break;
    }

    tokens.pop();
    let rhs = parse_expr(tokens, right_binding_power);

    lhs = {
      _type: operator._type as BinaryOperator,
      left: lhs,
      right: rhs,
    }
  }

  return lhs;
}

// left < right -> left associative
// left < right -> right associative
const INFIX_BINDING_POWER: { [k: string]: [number, number] } = {
  "+": [1, 2],
  "-": [1, 2],
  "*": [3, 4],
  "/": [3, 4],
  "^": [6, 5],
}

// All right associative
const PREFIX_BINDING_POWER: { [k: string]: number } = {
  "+": 5,
  "-": 5,
};

function prefix_binding_power(op: UnaryOperator): number {
  return PREFIX_BINDING_POWER[op];
}

function infix_binding_power(op: BinaryOperator): [number, number] {
  return INFIX_BINDING_POWER[op as string];
}
