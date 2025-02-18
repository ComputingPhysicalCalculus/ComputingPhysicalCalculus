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
    ["%"],
    ["^"],
    [","],
    ["("],
    [")"],
    [">"],
    ["<"],
    [">="],
    ["<="],
    ["=="],
    ["!="],
    ["="],
    [";"]
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
      "5+6*7/x^sin(45)><,=>=<=!=%==sum;product",
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
        TokenType.Gt,
        TokenType.Lt,
        TokenType.Comma,
        TokenType.Assign,
        TokenType.GtEq,
        TokenType.LtEq,
        TokenType.Neq,
        TokenType.Mod,
        TokenType.Eq,
        TokenType.Sum,
        TokenType.SemiColon,
        TokenType.Prod,
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

  const seq = (_type: "sum" | "prod", ident: string, start: ParsedExpression, end: ParsedExpression, value: ParsedExpression) => ({
    _type, ident, start, end, value
  });

  const v = (ident: string): ParsedExpression => ({
    _type: "var",
    ident,
  });

  const _let = (ident: string, value: ParsedExpression, cons: ParsedExpression): ParsedExpression => ({
    _type: "let",
    ident,
    value,
    cons,
  })
  
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
    [
      "5 + 6 == 6 * 7",
      bin(bin(lit(5), "+", lit(6)), "==", bin(lit(6), "*", lit(7))),
    ],
    [
      "5 + 6 >= 6 ^ 7",
      bin(bin(lit(5), "+", lit(6)), ">=", bin(lit(6), "^", lit(7))),
    ],
    [
      "sum(n=0,5,n)",
      seq("sum", "n", lit(0), lit(5), v("n")),
    ],
    [
      "product(n=0,8+5,n)",
      seq("prod", "n", lit(0), bin(lit(8), "+", lit(5)), v("n")),
    ],
    [
      "x=5;x",
      _let("x", lit(5), v("x")),
    ],
    [
      "x=y=z=5;z;y;(w=6;w)+w=6;x+w",
      _let("x", _let("y", _let("z", lit(5), v("z")), v("y")), bin(_let("w", lit(6), v("w")), "+", _let("w", lit(6), bin(v("x"), "+", v("w"))))),
    ],
    [
      "5x",
      bin(lit(5), "*", v("x")),
    ],
    [
      "5(6+7)",
      bin(lit(5), "*", bin(lit(6), "+", lit(7))),
    ],
    [
      "sin(x)(6+7)",
      bin(fn("sin", [v("x")]), "*", bin(lit(6), "+", lit(7))),
    ],
    [
      "e^5x",
      bin(v("e"), "^", bin(lit(5), "*", v("x"))),
    ]
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
    ["1 == 1", 1],
    ["1 == 0", 0],
    ["1 != 1", 0],
    ["1 != 2", 1],
    ["1 > 1", 0],
    ["1 > 0", 1],
    ["1 < 0", 0],
    ["1 < 2", 1],
    ["1 >= 1", 1],
    ["1 >= 0", 1],
    ["1 >= 2", 0],
    ["1 <= 0", 0],
    ["1 <= 1", 1],
    ["1 <= 2", 1],
    ["sum(n=0, 5, 1)", 6],
    ["product(n=0, 3, 2)", Math.pow(2, 4)],
    ["1+sum(i=0,16,1/product(j=0,i,j+1))", Math.E],
    ["abs(pi - 2*product(n=1,64,(n*2/(n*2-1))*(n*2/(n*2+1)))) < 0.05", 1],
    ["x=y=z=5;z;y;(w=6;w)+w=6;x+w", 17],
  ])("eval '%s' -> %d", (s, expected) => {
    expect(Expression.eval(s)).toBeCloseTo(expected, 8);
  });

  test.each([
    ["x", {x: 5}, 5],
    ["sin(x)", {x: Math.PI / 2}, Math.sin(Math.PI / 2)],
    ["x + y", {x: 6, y: 7}, 13],
    ["theta", {theta: Math.PI}, Math.PI],
  ])("eval '%s' with context %j -> %d", (s, ctx, expected) => {
    expect(Expression.eval(s, ctx)).toBeCloseTo(expected, 8);
  });

  test.each([
    ["abs(x)", Math.abs],
    ["acos(x)", Math.acos],
    ["acosh(x)", Math.acosh],
    ["asin(x)", Math.asin],
    ["asinh(x)", Math.asinh],
    ["atan(x)", Math.atan],
    ["atanh(x)", Math.atanh],
    ["ceil(x)", Math.ceil],
    ["cos(x)", Math.cos],
    ["cosh(x)", Math.cosh],
    ["deg(x)", x => x / (Math.PI / 180)],
    ["exp(x)", Math.exp],
    ["floor(x)", Math.floor],
    ["ln(x)", Math.log],
    ["rad(x)", x => x * (Math.PI / 180)],
    ["sign(x)", Math.sign],
    ["sin(x)", Math.sin],
    ["sinh(x)", Math.sinh],
    ["tan(x)", Math.tan],
    ["tanh(x)", Math.tanh],
    ["trunc(x)", Math.trunc],
  ])("test builtin function '%s'", (s, fn) => {
    let compiled = Expression.compile(s);
    for (let x = -Math.PI; x < Math.PI; x += 0.01) {
      let fn_result = fn(x);
      if (Number.isNaN(fn_result)) {
        expect(compiled({ x })).toBe(Number.NaN);
      } else {
        expect(compiled({ x })).toBeCloseTo(fn_result, 8);
      }
    }
  });

  test.each([
    ["atan2(x, y)", Math.atan2],
    ["log(x, y)", (lhs: number, rhs: number) => Math.log(rhs) / Math.log(lhs)],
    ["min(x, y)", Math.min],
    ["max(x, y)", Math.max],
  ])("test builtin function '%s'", (s, fn) => {
    let compiled = Expression.compile(s);
    for (let x = -Math.PI; x < Math.PI; x += 0.1) {
      for (let y = -Math.PI; y < Math.PI; y += 0.1) {
        let fn_result = fn(x, y);
        if (Number.isNaN(fn_result)) {
          expect(compiled({ x, y })).toBe(Number.NaN);
        } else {
          expect(compiled({ x, y })).toBeCloseTo(fn_result, 8);
        }
      }
    }
  });
  
  test.each([
    ["x+y", ["x", "y"]],
    ["z=0;z+x-y", ["x", "y"]],
    ["sum(n=z,g,g=8;u=5;x+y+u+n+g)", ["z", "g", "x", "y"]]
  ])("partial eval '%s' with undefined %j", (s, expected) => {
    const parsed = Expression.parse(s);
    const [_, vars] = Expression.partial_eval_expr(parsed);

    expect(Array.from(vars.keys())).toStrictEqual(expected)
  })
});
