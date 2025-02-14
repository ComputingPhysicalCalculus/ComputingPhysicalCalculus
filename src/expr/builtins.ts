type Function = {
  num_params: number,
  call: (...params: number[]) => number,
};

export const BUITLIN_FUNCTIONS: { [ident: string]: Function } = {
  // Binary operators
  "+": { num_params: 2, call: (lhs, rhs) => lhs + rhs, },
  "-": { num_params: 2, call: (lhs, rhs) => lhs - rhs, },
  "*": { num_params: 2, call: (lhs, rhs) => lhs * rhs, },
  "/": { num_params: 2, call: (lhs, rhs) => lhs / rhs, },
  "^": { num_params: 2, call: Math.pow, },

  // Trigonometric functions
  "sin": { num_params: 1, call: Math.sin },
  "cos": { num_params: 1, call: Math.cos},
  "tan": { num_params: 1, call: Math.tan },
};

export const BUILTIN_VARIABLES: { [ident: string]: number } = {
  "e": Math.E,
  "pi": Math.PI,
  "tau": Math.PI * 2,
  "phi": (1 + Math.sqrt(5)) / 2,
};
