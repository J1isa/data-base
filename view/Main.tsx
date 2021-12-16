import React from "preact/compat";

import "./Main.sass";
import { TabItem, Tabs } from "./Tabs";
import { Achivments } from "screen/Achivmets";
import { Events } from "screen/Events";
import { ClassGroups } from "../screen/ClassGroups";
import { Childs } from "screen/Childs";
import { Teachers } from "screen/Teachers";
import { useModal } from "./Modal";

export const Main = () => {
  const [modal] = useModal()

  return (
    <div className="main-component">
      <Tabs>
        <TabItem title="Награды">
          <Achivments />
        </TabItem>

        <TabItem title="Мероприятия">
          <Events />
        </TabItem>

        <TabItem title="Ученики">
          <Childs />
        </TabItem>

        <TabItem isDefault title="Учителя">
          <Teachers />
        </TabItem>

        <TabItem title="Классы">
          <ClassGroups />
        </TabItem>

      </Tabs>

      {modal}
    </div>
  )
}