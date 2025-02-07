import { desc } from "./decorator-desc.ts";

export type QueryAllDecorator = (
  proto: any,
  name: PropertyKey,
  descriptor?: PropertyDescriptor
  // TypeScript requires the return type to be `void|any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => void | any;

/**
 * A property decorator that is used to access all elements that match a specific query
 * selector.
 */
export function queryAll(selector: string): QueryAllDecorator {
  return ((
    obj: object,
    name: PropertyKey | ClassAccessorDecoratorContext<unknown, unknown>,
  ) => {
    return desc(obj, name, {
      get() {
        return document.querySelectorAll(selector);
      }
    })
  }) as QueryAllDecorator;
}

export type QueryDecorator = (
  proto: any,
  name: PropertyKey,
  descriptor?: PropertyDescriptor
  // Note TypeScript requires the return type to be `void|any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => void | any;

export function query(selector: string): QueryDecorator {
  return ((
    obj: object,
    name: PropertyKey | ClassAccessorDecoratorContext<unknown, unknown>,
  ) => {
    return desc(obj, name, {
      get() {
        return document.querySelector(selector);
      }
    })
  }) as QueryDecorator;
}
