import React from "preact/compat";

import { useRepository } from "lib/useRepository";
import { PeopleModel } from "model/People";
import { DateInput, TextInput, Form } from "view/Form";
import { closeModal, modalAlert, modalConfirm, setModal } from "view/Modal";
import { makeTable } from "view/Table";

const TeachersTable = makeTable(PeopleModel, [
  { title: 'ID', value: ({ id }) => id },
  { title: 'Имя', value: ({ fullName }) => fullName },
  { title: 'Класс', value: ({ ownClassGroup }) => ownClassGroup?.name || '-' },
  { title: 'Учеников', value: ({ ownClassGroup }) => ownClassGroup?.childs?.length },
  { title: 'Дата рождения', value: ({ birthday }) => birthday },
  { title: 'Наград', value: ({ takeAchivments }) => takeAchivments.length },
  { title: 'Мероприятий', value: ({ makeEvents }) => makeEvents.length },
  { value: 'Изменить', keyClick: 'edit' },
  { value: 'Удалить', keyClick: 'delete' }
])

export const Teachers = () => {
  const [data] = useRepository(PeopleModel, {
    where: { isTeacher: true },
    relationsFunc: [
      p => p.takeAchivments,
      p => p.makeEvents,
      p => p.ownClassGroup,
      p => p.ownClassGroup.childs
    ]
  })

  return (
    <div className={'content'}>
      <div className="buttons">
        <button onClick={() => setModal(<EditTeacher />)}>+</button>
      </div>
      <TeachersTable onClick={
        (key, item) => {
          switch (key) {
            case 'delete': {
              if (item.ownClassGroup)
                return modalAlert('Уберите класс!')

              modalConfirm('Удалить выбранный элемент?')
                .then(e => (e && item.remove()))
                .catch(console.error)
            } break
            case 'edit': {
              setModal(<EditTeacher teacher={item} />)
            } break
          }
        }
      } data={data} />
    </div>
  )
}

const EditTeacher = ({ teacher = new PeopleModel }) => {
  teacher.isTeacher = true

  const save = () => {
    teacher.save()
      .catch(console.error)
      .finally(closeModal)
  }

  let text = {
    type: 'Редактирование',
    save: 'Сохранить'
  }

  if (typeof teacher.id != 'number') {
    text.type = 'Создание'
    text.save = 'Создать'
  }

  return (
    <Form title={`${text.type} данных учителя`}>
      <TextInput
        name="Фамилия"
        target={teacher}
        prop="secondName" />

      <TextInput
        name="Имя"
        target={teacher}
        prop="firstName" />

      <TextInput
        name="Отчество"
        target={teacher}
        prop="lastName" />

      <DateInput
        name="Дата рождения"
        target={teacher}
        prop="birthday" />

      <button onClick={save}>{text.save}</button>
    </Form>
  )
}