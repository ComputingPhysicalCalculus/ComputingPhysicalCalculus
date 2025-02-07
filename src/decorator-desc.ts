// @ts-nocheck

// This file is used to trick Typescript into type checking the `desc` function.
// As it thinks it doesn't exits, when it definitely does.
//
// Do not add anything else to this file.

import { desc as _desc } from "@lit/reactive-element/decorators/base.js"

export const desc: (
  obj: object,
  name: PropertyKey | ClassAccessorDecoratorContext<unknown, unknown>,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor = _desc;
