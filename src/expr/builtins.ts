export const BUITLIN_FUNCTIONS: { [ident: string]: (...params: number[]) => number } = {
  // Binary operators
  "+": (lhs, rhs) => lhs + rhs,
  "-": (lhs, rhs) => lhs - rhs,
  "*": (lhs, rhs) => lhs * rhs,
  "/": (lhs, rhs) => lhs / rhs,
  "%": (lhs, rhs) => lhs % rhs,
  "^": Math.pow,
  ">": (lhs, rhs) => lhs > rhs ? 1.0 : 0.0,
  "<": (lhs, rhs) => lhs < rhs ? 1.0 : 0.0,
  ">=": (lhs, rhs) => lhs >= rhs ? 1.0 : 0.0,
  "<=": (lhs, rhs) => lhs <= rhs ? 1.0 : 0.0,
  "==": (lhs, rhs) => Math.abs(lhs - rhs) < 1e-8 ? 1.0 : 0.0,
  "!=": (lhs, rhs) => Math.abs(lhs - rhs) > 1e-8 ? 1.0 : 0.0,

  "abs": Math.abs,
  "acos": Math.acos,
  "acosh": Math.acosh,
  "acot": x => Math.atan(1 / x),
  "acsc": x => Math.asin(1 / x),
  "acsch": x => Math.asinh(1 / x),
  "asec": x => Math.acos(1 / x),
  "asech": x => Math.acosh(1 / x),
  "asin": Math.asin,
  "asinh": Math.asinh,
  "atan": Math.atan,
  "atan2": Math.atan2,
  "atanh": Math.atanh,
  "acoth": x => Math.tanh(1 / x),

  "ceil": Math.ceil,
  "cos": Math.cos,
  "cosh": Math.cosh,
  "cot": x => 1 / Math.tan(x),
  "coth": x => Math.cosh(x) / Math.sinh(x),
  "csc": x => 1 / Math.sin(x),
  "csch": x => 1 / Math.sinh(x),

  "deg": x => x / (Math.PI / 180),

  "exp": Math.exp,

  "floor": Math.floor,

  "log": (lhs, rhs) => Math.log(rhs) / Math.log(lhs),
  "ln": Math.log,

  "max": Math.max,
  "min": Math.min,

  "rad": x => x * (Math.PI / 180),

  "sign": Math.sign,
  "sin": Math.sin,
  "sinh": Math.sinh,
  "sec": x => 1 / Math.cos(x),
  "sech": x => 1 / Math.cosh(x),

  "tan": Math.tan,
  "tanh": Math.tanh,
  "trunc": Math.trunc,
};

export const BUILTIN_VARIABLES: { [ident: string]: number } = {
  "e": Math.E,
  "pi": Math.PI,
  "tau": Math.PI * 2,
  "phi": (1 + Math.sqrt(5)) / 2,
};
