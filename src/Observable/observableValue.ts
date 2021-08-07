import { AnyFunction } from "../types";
import globalState from "../globalState";

class ObservableValue {
  private readonly observers: AnyFunction[] = [];
  constructor(private value: any) {}

  set(value: any) {
    try {
      this.executeObservers();
    } catch (e) {
      console.log(e);
    }

    this.value = value;
  }

  //todo нужен декоратор для отлавливания executableCallback
  get() {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);

    return this.value;
  }

  observe(callback: AnyFunction) {
    this.observers.push(callback);
  }

  unobserve(callback: AnyFunction) {
    this.observers.splice(this.observers.indexOf(callback), 1);
  }

  private executeObservers() {
    this.observers.forEach((observer) => observer());
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
