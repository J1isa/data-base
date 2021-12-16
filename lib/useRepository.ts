
import EventEmitter from "events"
import { useEffect, useState } from "preact/hooks"
import { FindManyOptions } from "typeorm"
import { Base } from "./baseClass"
import { awaitConnection } from "./connection"
import { getRelations, IRelation } from "./getRelations"

interface TOptions<T extends typeof Base> extends FindManyOptions<T> {
  relationsFunc?: IRelation<T>[]
}

export const useRepository = <
  T extends typeof Base,
  B extends InstanceType<T>
>(rep: T, options: TOptions<T> = {}): [B[], (v: B[]) => any] => {
  const [data, setData] = useState<B[]>(null)
  const { relations = [], relationsFunc = [] } = options

  options.relations = [
    ...relations,
    ...getRelations(rep, relationsFunc)
  ]

  useEffect(() => {
    if (!data)
      awaitConnection
        .then(conn => {
          return conn.getRepository(rep)
            .find(options)
        })
        .then(e => setData(e as any))
        .catch(console.error)


    if (rep['events'] instanceof EventEmitter) {
      const change = () => setData(null)
      rep['events'].once('change', change)
      return () => rep['events'].off('change', change)
    }
  })

  return [data || [], setData]
}