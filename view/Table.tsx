import { Base } from "lib/baseClass";
import React, { FC } from "preact/compat";

import "./Table.sass";

interface IColumn<V, I extends string> {
  title?: string
  value: ((v: V) => any) | string
  align?: 'left' | 'right' | 'center'
  keyClick?: I
}

const val = (v) => {
  if (typeof v == 'undefined')
    return '-'

  if (v == null)
    return 'null'

  return `${v}`
}

export const makeTable =
  function <
    T extends typeof Base,
    I extends string,
    D = InstanceType<T>
  >(base: T, params: IColumn<D, I>[]) {
    const Component: FC<{
      data?: D[],
      onClick?: (k: IColumn<D, I>['keyClick'], v: D) => void
    }> = ({
      data = [],
      onClick = () => { }
    }) => (
        <div className="table-component">
          <table>
            <tr>
              {params.map(({ title = '' }, key) => (
                <th key={`t-` + key}>
                  <div>{title}</div>
                </th>
              ))}
              <th data-empty />
            </tr>
            {!data.length && (
              <tr data-empty key={`item-empty`}>
                {params.map(({ align, title }, key) => {
                  return (
                    <td data-align={align} key={`item-${key}`}>
                      <p>{title || 'Кнопка'}</p>
                      <p>{'Бла бла бла'}</p>
                    </td>
                  )
                })}
                <td data-empty />
              </tr>
            )}
            {data.map((item, i) => (
              <tr key={`item-${i}`}>
                {params.map(({ value, keyClick, align, title }, key) => {
                  if (!(item instanceof base))
                    return

                  const i = val(typeof value == 'function' ? value(item) : value)

                  return (
                    <td data-align={align} key={`item-${i}-${key}`}>
                      <p>{title || 'Кнопка'}</p>
                      <p>
                        {keyClick ? (
                          <a onClick={
                            () => onClick(keyClick, item)
                          }>{i}</a>
                        ) : i}
                      </p>
                    </td>
                  )
                })}
                <td data-empty />
              </tr>
            ))}
          </table>
        </div>

      )

    return Component
  }