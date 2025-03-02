import { BinaryOperator, ParsedExpression as ParsedExpression, UnaryOperator } from "./ParsedExpression";

export enum TokenType {
  Ident = "ident",
  Literal = "lit",
  Sum = "sum",
  Prod = "prod",
  LBracket = "(",
  RBracket = ")",
  Comma = ",",
  Add = "+",
  Sub = "-",
  Mul = "*",
  Div = "/",
  Mod = "%",
  Pow = "^",
  Gt = ">",
  Lt = "<",
  GtEq = ">=",
  LtEq = "<=",
  Eq = "==",
  Neq = "!=",
  Assign = "=",
  SemiColon = ";",
}

export type Token = {
  _type: TokenType,
  span: string,
};

const PUNCTUATION_REGEX = /^(>=|<=|!=|==|[+\-*/\^,.()><=%;])/;
const NUMBER_REGEX = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
const SUM_PROD_REGEX = /^(sum|product)/;
const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*/;

export function next_token(s: string): [Token | null, string] {
  s = s.trim();

  let regexes: { r: RegExp, _type: (match: string) => TokenType }[] = [
    { r: PUNCTUATION_REGEX, _type: match => match as TokenType, },
    { r: NUMBER_REGEX, _type: _ => TokenType.Literal },
    { r: SUM_PROD_REGEX, _type: (match: string) => match.slice(0, Math.min(match.length, 4)) as TokenType },
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
  let lhs = parse_term(tokens);

  outer_loop: while (true) {
    let operator = tokens[tokens.length - 1];
    if (operator === undefined) {
      break;
    }

    let error = false;
    switch (operator._type) {
      case TokenType.Add:
      case TokenType.Sub:
      case TokenType.Mul:
      case TokenType.Div:
      case TokenType.Pow:
      case TokenType.GtEq:
      case TokenType.LtEq:
      case TokenType.Gt:
      case TokenType.Lt:
      case TokenType.Eq:
      case TokenType.Neq:
      case TokenType.Mod:
        break;
      case TokenType.RBracket:
      case TokenType.Comma:
      case TokenType.SemiColon:
        break outer_loop;
      case TokenType.Ident:
      case TokenType.LBracket: {
        if (lhs._type === "var") {
          error = true;
          break;
        }
        let rhs = parse_term(tokens);
        lhs = { _type: "*", left: lhs, right: rhs };
      } continue;
      default:
        error = true ;
        break;
    }

    if (error) {
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

export function parse_term(tokens: Token[]): ParsedExpression {
  let lhs_tk = tokens.pop();
  if (lhs_tk === undefined) {
    throw new Error("Empty expression encountered");
  }

  let lhs: ParsedExpression;
  outer_switch: switch (lhs_tk._type) {
    case TokenType.Ident: {
      let peeked_tk = tokens[tokens.length - 1];
      switch (peeked_tk?._type) {
        case TokenType.LBracket:
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
        case TokenType.Assign:
          tokens.pop();
          const value = parse_expr(tokens, 0);
          let tk = tokens.pop();
          if (tk === undefined) {
            lhs = {
              _type: "let",
              ident: lhs_tk.span,
              value,
              cons: { _type: "lit", value: 0 }
            };
            break;
          }
          if (tk._type !== TokenType.SemiColon) {
            throw new Error(`Unexpected token '${tk.span}' of type ${tk._type}`);
          }
          if (tokens.length < 1) {
            lhs = {
              _type: "let",
              ident: lhs_tk.span,
              value,
              cons: { _type: "lit", value: 0 }
            };
            break;
          }
          const cons = parse_expr(tokens, 0);
          lhs = { _type: "let", ident: lhs_tk.span, value, cons }
          break;
        default:
          lhs = { _type: "var", ident: lhs_tk.span };
          break outer_switch;
      }
    } break;
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

    // Summation and product
    case TokenType.Sum:
    case TokenType.Prod: {
      let peeked_tk = tokens[tokens.length - 1];
      if (peeked_tk === undefined || peeked_tk._type !== TokenType.LBracket) {
        lhs = { _type: "var", ident: lhs_tk.span };
        break;
      }
      tokens.pop();

      const expect = (tt: TokenType): Token => {
        let tk = tokens.pop();
        if (tk === undefined) {
          throw new Error(`Unclosed left bracket`);
        }
        if (tk._type !== tt) {
          throw new Error(`Unexpected token '${tk.span}' of type ${tk._type}`);
        }

        return tk;
      }

      let ident_tk = expect(TokenType.Ident);
      expect(TokenType.Assign);
      let start = parse_expr(tokens, 0);
      expect(TokenType.Comma);
      let end = parse_expr(tokens, 0);
      expect(TokenType.Comma);
      let value = parse_expr(tokens, 0);
      expect(TokenType.RBracket);

      lhs = { _type: lhs_tk._type, ident: ident_tk.span, start, end, value }
    } break;

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

  return lhs;
}

// left < right -> left associative
// left < right -> right associative
const INFIX_BINDING_POWER: { [k: string]: [number, number] } = {
  "<": [0, 1],
  ">": [0, 1],
  "<=": [0, 1],
  ">=": [0, 1],
  "==": [0, 1],
  "!=": [0, 1],
  "+": [2, 3],
  "-": [2, 3],
  "*": [4, 5],
  "/": [4, 5],
  "%": [4, 5],
  "^": [7, 6],
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
