import React from "preact/compat";

import { useRepository } from "lib/useRepository";
import { PeopleModel } from "model/People";
import { makeTable } from "view/Table";
import { DateInput, Form, TextInput, SelectInput } from "view/Form";
import { closeModal, modalConfirm, setModal } from "view/Modal";
import { ClassGroupModel } from "model/ClassGroup";

const ChildsTable = makeTable(PeopleModel, [
  { title: 'ID', value: ({ id }) => id },
  { title: 'Имя', value: ({ name }) => name },
  { title: 'Класс', value: ({ classGroup }) => classGroup?.name },
  { title: 'Дата рождения', value: ({ birthday }) => birthday },
  { title: 'Руководитель', value: ({ classGroup }) => classGroup?.controll?.fullName },
  { title: 'Наград', value: ({ haveAchivments }) => haveAchivments.length },
  // { title: 'Мероприятий', value: ({ eventMembers }) => eventMembers?.length },
  { value: 'Изменить', keyClick: 'edit' },
  { value: 'Удалить', keyClick: 'delete' }
])

export const Childs = () => {
  const [data] = useRepository(PeopleModel, {
    where: { isTeacher: false },
    relationsFunc: [
      e => e.haveAchivments,
      // e => e.eventMembers,
      e => e.classGroup,
      e => e.classGroup.controll
    ]
  })

  return (
    <div className={'content'}>
      <div className="buttons">
        <button onClick={() => setModal(<EditChild />)}>+</button>
      </div>
      <ChildsTable onClick={
        (key, item) => {
          switch (key) {
            case 'delete': {
              modalConfirm('Удалить выбранный элемент?')
                .then(e => e && item.remove())
                .catch(console.error)
            } break
            case 'edit': {
              setModal(<EditChild child={item} />)
            } break
          }
        }
      } data={data} />
    </div>
  )
}


const EditChild = ({ child = new PeopleModel }) => {
  child.isTeacher = false

  const [classes] = useRepository(ClassGroupModel)

  const selectClasses = classes
    .map(e => ({ name: e.name, value: e }))

  const save = () => {
    child.save()
      .catch(console.error)
      .finally(closeModal)
  }

  let text = {
    type: 'Редактирование',
    save: 'Сохранить'
  }

  if (typeof child.id != 'number') {
    text.type = 'Создание'
    text.save = 'Создать'
  }

  return (
    <Form title={`${text.type} данных ученика`}>
      <TextInput
        name="Фамилия"
        target={child}
        prop="secondName" />

      <TextInput
        name="Имя"
        target={child}
        prop="firstName" />

      <TextInput
        name="Отчество"
        target={child}
        prop="lastName" />

      <DateInput
        name="Дата рождения"
        target={child}
        prop="birthday" />

      <SelectInput
        name="Класс"
        target={child}
        prop="classGroup"
        data={selectClasses} />

      <button onClick={save}>{text.save}</button>
    </Form>
  )
}