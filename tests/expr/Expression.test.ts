import { describe, expect, test } from "vitest";
import { Token, TokenType, next_token } from "../../src/expr/Parser";
import { BinaryOperator, ParsedExpression, UnaryOperator } from "../../src/expr/ParsedExpression";
import Expression from "../../src/expr/Expression";

describe("expression lexing", _ => {
  test.each([
    ["1"],
    ["12"],
    ["1.4"],
    ["1e4"],
    ["1e-4"],
    ["1e+4"],
  ])("lex '%s' as literal", (s) => {
    const [tk, rest] = next_token(s);

    expect(tk?._type).toBe(TokenType.Literal);
    expect(tk?.span).toBe(s);
    expect(rest).toBe("");
  });

  test.each([
    ["s"],
    ["sin"],
    ["x_554"],
  ])("lex '%s' as identifier", (s) => {
    const [tk, rest] = next_token(s);

    expect(tk?._type).toBe(TokenType.Ident);
    expect(tk?.span).toBe(s);
    expect(rest).toBe("");
  });

  test.each([
    ["+"],
    ["-"],
    ["*"],
    ["/"],
    ["^"],
    [","],
    ["("],
    [")"],
  ])("lex '%s' as punctuation", (s) => {
    const [tk, rest] = next_token(s);

    expect(tk?._type).toBe(s);
    expect(tk?.span).toBe(s);
    expect(rest).toBe("");
  });

  test.each([
    [
      "+-()/*^",
      [
        TokenType.Add,
        TokenType.Sub,
        TokenType.LBracket,
        TokenType.RBracket,
        TokenType.Div,
        TokenType.Mul,
        TokenType.Pow,
      ]
    ],
    [
      "5+6*7/x^sin(45)",
      [
        TokenType.Literal,
        TokenType.Add,
        TokenType.Literal,
        TokenType.Mul,
        TokenType.Literal,
        TokenType.Div,
        TokenType.Ident,
        TokenType.Pow,
        TokenType.Ident,
        TokenType.LBracket,
        TokenType.Literal,
        TokenType.RBracket,
      ],
    ]
  ])("lex '%s' -> %j", (s, expected) => {
    const token_types: TokenType[] = [];
    let token: Token | null = null;
    let rest = s;

    while ([token, rest] = next_token(rest), token) {
      token_types.push(token._type);
    }

    expect(token_types).toStrictEqual(expected);
  });
});

describe("expression parsing", () => {
  const lit = (value: number): ParsedExpression => ({
    _type: "lit",
    value,
  });

  const bin = (left: ParsedExpression, op: BinaryOperator, right: ParsedExpression): ParsedExpression => ({
    _type: op,
    left,
    right,
  });

  const un = (op: UnaryOperator, right: ParsedExpression): ParsedExpression => ({
    _type: op,
    right,
  });

  const fn = (ident: string, params: ParsedExpression[]): ParsedExpression => ({
    _type: "fn",
    ident,
    params,
  });
  
  test.each([
    [
      "5 + 6",
      bin(lit(5), "+", lit(6)),
    ],
    [
      "5 + 6 * 7",
      bin(lit(5), "+", bin(lit(6), "*", lit(7))),
    ],
    [
      "5 * 6 + 7",
      bin(bin(lit(5), "*", lit(6)), "+", lit(7)),
    ],
    [
      "5 - 6 * 7",
      bin(lit(5), "-", bin(lit(6), "*", lit(7))),
    ],
    [
      "5 + 6 / 7",
      bin(lit(5), "+", bin(lit(6), "/", lit(7))),
    ],
    [
      "5 / 6 + 7",
      bin(bin(lit(5), "/", lit(6)), "+", lit(7)),
    ],
    [
      "5 + 6 ^ 7 + 8",
      bin(bin(lit(5), "+", bin(lit(6), "^", lit(7))), "+", lit(8)),
    ],
    [
      "5 + 6 ^ 7 ^ 8",
      bin(lit(5), "+", bin(lit(6), "^", bin(lit(7), "^", lit(8)))),
    ],
    [
      "5 * 6 * 7",
      bin(bin(lit(5), "*", lit(6)), "*", lit(7)),
    ],
    [
      "5 + 6 + 7",
      bin(bin(lit(5), "+", lit(6)), "+", lit(7)),
    ],
    [
      "-5",
      un("-", lit(5)),
    ],
    [
      "+5",
      un("+", lit(5)),
    ],
    [
      "-5 * 6",
      bin(un("-", lit(5)), "*", lit(6)),
    ],
    [
      "(((0)))",
      lit(0),
    ],
    [
      "(5 + 6) * 7",
      bin(bin(lit(5), "+", lit(6)), "*", lit(7)),
    ],
    [
      "5 + (6 * 7)",
      bin(lit(5), "+", bin(lit(6), "*", lit(7))),
    ],
    [
      "x(6)",
      fn("x", [lit(6)]),
    ],
    [
      "x(6, 7)",
      fn("x", [lit(6), lit(7)]),
    ],
    [
      "x(y(6, 7), 8)",
      fn("x", [fn("y", [lit(6), lit(7)]), lit(8)]),
    ],
  ])("parse '%s' -> %j", (s, expected) => {
    expect(Expression.parse(s)).toStrictEqual(expected);
  })
});

describe("expression evaluation", () => {
  test.each([
    ["pi", Math.PI],
    ["tau", Math.PI * 2],
    ["e", Math.E],
    ["phi", (1 + Math.sqrt(5)) / 2],
    ["1 + 2", 3],
    ["4 * 5", 20],
    ["2 ^ 6", Math.pow(2, 6)],
    ["2 ^ pi", Math.pow(2, Math.PI)],
    ["sin(pi / 2)", Math.sin(Math.PI / 2)],
    ["cos(pi)", Math.cos(Math.PI)],
    ["tan(2)", Math.tan(2)],
  ])("eval '%s' -> %d", (s, expected) => {
    expect(Expression.eval(s)).toBeCloseTo(expected, 8);
  })
});
