import { ReactiveHandler } from "./reactiveHandler";
import { TargetValue, TargetWithReactiveSymbol } from "../../types";
import { propertyIsLength } from "../../utils";
import { $gravelReactive } from "../../common/constants";
import { ObservableArray } from "../observableArray";

type ArrayMethodsNames = keyof typeof arrayMethods;
type ArrayMethods = typeof arrayMethods[ArrayMethodsNames];

const arrayMethods = {
  push(...items: any[]): number {
    //todo в конце делать notify
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    internalReactiveInstance.spliceWithArray(internalReactiveInstance._getValues().length, 0, items);
    return internalReactiveInstance.getLength();
  },

  getReactiveInstance<Target extends Array<any>>() {
    return (this as any)[$gravelReactive] as ObservableArray<Target>;
  },
};

export class ArrayHandlers<Target extends Array<any>> extends ReactiveHandler<Target> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> | ArrayMethods {
    const arrayMethod = arrayMethods[property as ArrayMethodsNames];
    if (arrayMethod) return arrayMethod.bind(target);

    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }

  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    const reactiveField = this.getReactiveField(target as TargetWithReactiveSymbol<Target>);

    if (propertyIsLength(property)) return reactiveField.setLength(value);
    return reactiveField.set(target, property, value);
  }
}
