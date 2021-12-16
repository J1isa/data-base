import React from "preact/compat";

import { useRepository } from "lib/useRepository";
import { ClassGroupModel } from "model/ClassGroup";
import { makeTable } from "view/Table";
import { closeModal, modalConfirm, setModal } from "view/Modal";
import { Form, SelectInput } from "view/Form";
import { PeopleModel } from "model/People";

const ClassesTable = makeTable(ClassGroupModel, [
  { title: 'ID', value: ({ id }) => id },
  { title: 'Класс', value: ({ name }) => name },
  { title: 'Учеников', value: ({ childs }) => childs.length },
  { title: 'Руководитель', value: ({ controll }) => controll?.fullName || '-' },
  { value: 'Изменить', keyClick: 'edit' },
  { value: 'Удалить', keyClick: 'delete' }
])

export const ClassGroups = () => {
  const [data] = useRepository(ClassGroupModel, {
    relationsFunc: [
      e => e.childs,
      e => e.controll
    ]
  })

  return (
    <div className={'content'}>
      <div className="buttons">
        <button onClick={() => setModal(<EditClass />)}>+</button>
      </div>
      <ClassesTable onClick={
        (key, item) => {
          switch (key) {
            case 'delete': {
              modalConfirm('Удалить выбранный элемент?')
                .then(e => e && item.remove())
                .catch(console.error)
            } break
            case 'edit': {
              setModal(<EditClass group={item} />)
            } break
          }
        }
      } data={data} />
    </div>
  )
}

const EditClass = ({ group = new ClassGroupModel }) => {
  const save = () => {
    group.save()
      .catch(console.error)
      .finally(closeModal)
  }

  let text = {
    type: 'Редактирование',
    save: 'Сохранить'
  }

  if (typeof group.id != 'number') {
    text.type = 'Создание'
    text.save = 'Создать'
  }

  const [teachers] = useRepository(PeopleModel, {
    where: {
      isTeacher: true
    },
    relationsFunc: [
      p => p.ownClassGroup
    ]
  })

  const seletTeachers = teachers
    .filter(e => !e.ownClassGroup || e.ownClassGroup.equal(group))
    .map(e => ({ name: e.fullName, value: e }))

  return (
    <Form title={`${text.type} класса`}>
      <SelectInput
        name="Класс"
        target={group}
        prop="level"
        data={ClassGroupModel.levels} />

      <SelectInput
        name="Буква"
        target={group}
        prop="subLevel"
        data={ClassGroupModel.subLevels} />

      <SelectInput
        name="Руководитель"
        target={group}
        prop="controll"
        data={seletTeachers} />

      <button onClick={save}>{text.save}</button>
    </Form>
  )
}