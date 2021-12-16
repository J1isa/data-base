import { BaseEntity } from "typeorm";
import { Base } from "./baseClass";

export type IRelation<B extends typeof Base> = (e: InstanceType<B>) => any

export const getRelations = (
  <T extends typeof Base>(v: T, r: IRelation<T>[]) => {
    return r.map(e => {
      const str = e.toString()
      const [name, expr] = str.split(/\s+=>\s+/)
      return expr.replace(`${name}.`, '')
    })
  }
)