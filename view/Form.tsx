import { EntityModel } from "model/Entity";
import React, { FC } from "preact/compat";

import "./Form.sass";

export const Form: FC<{ title?: string }> = ({ children, title }) => {
  return (
    <div className={'form-component'}>
      {title && <p>{title}</p>}
      {children}
    </div>
  )
}

interface IObject {
  [key: string]: any
}

type ExtractKeysOfValueType<T, K> = {
  [I in keyof T]: T[I] extends K ? I : never
}[keyof T]

export const TextInput = function <
  T extends IObject,
  K extends ExtractKeysOfValueType<T, String>
>({ target, prop, name }: {
  target: T,
  prop: K,
  name?: string
}) {
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLInputElement)
      (target as any)[prop] = v.value
  }

  return (
    <div className="row">
      {name && <span>{name}</span>}
      <input
        type="text"
        value={(target as any)[prop]}
        onChange={onInput}
        onInput={onInput}
        className="text-input" />
    </div>
  )
}

export const TextAreaInput = function <
  T extends IObject,
  K extends ExtractKeysOfValueType<T, String>
>({ target, prop, name }: {
  target: T,
  prop: K,
  name?: string
}) {
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLTextAreaElement)
      (target as any)[prop] = v.value
  }

  return (
    <div className="row area">
      {name && <span>{name}</span>}
      <textarea
        type="text"
        onChange={onInput}
        onInput={onInput}
        className="text-input">{(target as any)[prop]}</textarea>
    </div>
  )
}

export const PasswordInput = function <
  T extends IObject,
  K extends ExtractKeysOfValueType<T, String>
>({ target, prop, autoFocus, name }: {
  target: T,
  prop: K,
  autoFocus?: boolean,
  name?: string
}) {
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLInputElement)
      (target as any)[prop] = v.value
  }

  return (
    <div className="row">
      {name && <span>{name}</span>}
      <input
        type="password"
        value={(target as any)[prop]}
        autoFocus={autoFocus}
        onChange={onInput}
        onInput={onInput}
        className="text-input" />
    </div>
  )
}

export const DateInput = function <
  T extends IObject,
  K extends ExtractKeysOfValueType<T, Date>
>({ target, prop, name }: {
  target: T,
  prop: K,
  name?: string
}) {
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLInputElement)
      (target as any)[prop] = new Date(v.value)
  }

  return (
    <div className="row">
      {name && <span>{name}</span>}
      <input
        type="date"
        value={(target as any)[prop]}
        onChange={onInput}
        onInput={onInput}
        className="text-input" />
    </div>
  )
}

interface IDataSelect<T> {
  name: string
  value: T
}

export const SelectInput = function <
  T extends IObject,
  P extends any,
  K extends ExtractKeysOfValueType<T, P>
>({ target, prop, name, data }: {
  target: T,
  prop: K,
  data: IDataSelect<P>[],
  name?: string
}) {
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLSelectElement)
      (target as any)[prop] = data[+v.value]?.value || null
  }

  const is = (a, b) => {
    if(
      a instanceof EntityModel &&
      b instanceof EntityModel
    ) return a.equal(b)

    return JSON.stringify(a) == JSON.stringify(b)
  }

  return (
    <div className="row">
      {name && <span>{name}</span>}
      <select onChange={onInput}>
        <option value={-1}>-</option>

        {data.map((e, i) => (
          <option selected={is(e.value, (target as any)[prop])} value={i}>{`${e.name}`}</option>
        ))}
      </select>
    </div>
  )
}

export const MultySelectInput = function <
  T extends IObject,
  P extends any,
  K extends ExtractKeysOfValueType<T, P[]>
>({ target, prop, name, data }: {
  target: T,
  prop: K,
  data: IDataSelect<P>[],
  name?: string
}) {
  console.log(data)
  const onInput = ({ target: v }) => {
    if (v instanceof HTMLSelectElement)
      console.log((target as any)[prop] = [...v.children]
      .filter(e => e instanceof HTMLOptionElement)
      .filter(e => e['selected'])
      .map(e => data[+e['value']]?.value)
      .filter(e => e))
      
  }

  const is = (a, b) => {
    if(
      a instanceof EntityModel &&
      b instanceof EntityModel
    ) return a.equal(b)

    return JSON.stringify(a) == JSON.stringify(b)
  }

  const has = (a: any[], b) => {
    return !!(a || []).find(e => is(e, b))
  }

  return (
    <div className="row">
      {name && <span>{name}</span>}
      <select multiple={true} onChange={onInput}>
        <option value={-1}>-</option>

        {data.map((e, i) => (
          <option selected={has((target as any)[prop], e.value)} value={i}>{`${e.name}`}</option>
        ))}
      </select>
    </div>
  )
}