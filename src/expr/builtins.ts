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
  "asin": Math.asin,
  "asinh": Math.asinh,
  "atan": Math.atan,
  "atan2": Math.atan2,
  "atanh": Math.atanh,

  "ceil": Math.ceil,
  "cos": Math.cos,
  "cosh": Math.cosh,

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
