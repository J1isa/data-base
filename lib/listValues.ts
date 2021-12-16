import { equal } from "./equal";

export class ListValues<T extends any> extends Array<{ name: string, value: T }> {
  constructor(v: { name: string, value: T }[]) {
    super()

    if(Array.isArray(v))
      this.push(...v)
  }

  getName(value: T) { return this.find(e => equal(e.value, value))?.name }
}