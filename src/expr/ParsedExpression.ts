export type BinaryOperator = "+" | "-" | "/" | "*" | "^" | "==" | "!=" | ">" | "<" | ">=" | "<=" | "%";

export type BinaryOperation = {
  _type: BinaryOperator,
  left: ParsedExpression,
  right: ParsedExpression,
};

export type UnaryOperator = "-" | "+";

export type UnaryOperation = {
  _type: UnaryOperator,
  right: ParsedExpression,
};

export type FunctionCall = {
  _type: "fn",
  ident: string,
  params: ParsedExpression[],
};

export type Variable = {
  _type: "var",
  ident: string,
};

export type Literal = {
  _type: "lit",
  value: number,
};

export type Sequence = {
  _type: "prod" | "sum",
  ident: string,
  start: ParsedExpression,
  end: ParsedExpression,
  value: ParsedExpression,
};

export type ParsedExpression =
  | BinaryOperation
  | UnaryOperation
  | FunctionCall
  | Variable
  | Literal
  | Sequence
  ;
