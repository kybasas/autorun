import { ObservableValue } from "./Observable/observableValue";
import { CommonlyConstructors } from "./types";

export const entries = Object.entries;

export function is(Ctor: CommonlyConstructors, val: { constructor: any } | null) {
  return (val != null && val.constructor === Ctor) || val instanceof Ctor;
}

export function isString(arg: any): arg is string {
  return is(String, arg);
}

export function isNumber(arg: any): arg is number {
  return is(Number, arg);
}

export function isFunction(arg: any): arg is Function {
  return is(Function, arg);
}

export function isArray(arg: any): arg is Array<any> {
  return is(Array, arg);
}

export function isPureObject(arg: any): arg is Record<string, any> {
  return is(Object, arg) && !Array.isArray(arg);
}

export function isPrimitive(arg: any): arg is string | number {
  return isString(arg) || isNumber(arg);
}

export function toPrimitive(value: any) {
  return value === null ? null : typeof value === "object" ? "" + value : value;
}

type EntriesTuple<Target extends object> = [keyof Target, Target[keyof Target]];

export function transformEach<Target extends object, NewObject extends object>(target: Target) {
  return (predicate: (entries: EntriesTuple<Target>) => NewObject): NewObject => {
    const newObject = {};

    Object.entries(target).forEach(([key, value]) =>
      Object.assign(newObject, predicate([key, value] as EntriesTuple<Target>)),
    );

    return newObject as NewObject;
  };
}

export function hasProp(target: Object, prop: PropertyKey): boolean {
  return Object.hasOwnProperty.call(target, prop);
}

export function isObservableValue(value: any) {
  return value instanceof ObservableValue;
}
