import React, { FC, useState } from "preact/compat";

import "./Tabs.sass";

interface ITabItem {
  title: string
  isDefault?: boolean
  children: any
}

export const TabItem: FC<ITabItem> = () => {
  return (<></>)
}

export const Tabs: FC = ({children}) => {
  if(!Array.isArray(children))
    children = [children]

  const items = (children as {props: ITabItem, type}[])
    .filter(({type}) => {
      return type == TabItem
    })
    .map(e => e.props)

  const startIndex = items.findIndex(e => e.isDefault)
  const [tab, setTab] = useState(startIndex != -1 ? startIndex : 0)
  
  return (
    <div className="tabs-component">
      <div className="tabs-header">
        {items.map((e, i) => {
          return (
            <button disabled={i==tab} onClick={() => setTab(i)}>
              {e.title}
            </button>
          )
        })}
      </div>
      <div className="tabs-content">
        {items[tab].children}
      </div>
    </div>
  )
}