import React from "preact/compat";

import { useRepository } from "lib/useRepository";
import { EventModel } from "model/Event";
import { makeTable } from "view/Table";
import { closeModal, modalAlert, modalConfirm, setModal } from "view/Modal";
import { Form, TextAreaInput, TextInput, SelectInput, MultySelectInput, DateInput } from "view/Form";
import { PeopleModel } from "model/People";

const EventsTable = makeTable(EventModel, [
  { title: 'ID', value: ({ id }) => id },
  { title: 'Уровень', value: ({ level }) => EventModel.levels.getName(level) },
  { title: 'Название', value: ({ name }) => name },
  { title: 'Описание', value: 'Читать...', keyClick: 'read' },
  { title: 'Дата начала', value: ({ startDate }) => startDate },
  { title: 'Дата конца', value: ({ endDate }) => endDate },
  { title: 'Руководитель', value: ({ maker }) => maker?.fullName },
  // { title: 'Участников', value: ({ members }) => members.length },
  { title: 'Наград', value: ({ achivments }) => achivments.length },
  { value: 'Изменить', keyClick: 'edit' },
  { value: 'Удалить', keyClick: 'delete' }
])

export const Events = () => {
  const [data] = useRepository(EventModel, {
    relationsFunc: [
      // e => e.members,
      e => e.maker,
      e => e.achivments,
    ]
  })

  return (
    <div className={'content'}>
      <div className="buttons">
        <button onClick={() => setModal(<EditEvent />)}>+</button>
      </div>
      <EventsTable onClick={
        (key, item) => {
          switch (key) {
            case 'read': {
              modalAlert(item.description)
            } break

            case 'delete': {
              modalConfirm('Удалить выбранный элемент?')
                .then(e => e && item.remove())
                .catch(console.error)
            } break

            case 'edit': {
              setModal(<EditEvent event={item} />)
            } break
          }
        }
      } data={data} />
    </div>
  )
}

const EditEvent = ({ event = new EventModel }) => {

  const save = () => {
    event.save()
      .catch(console.error)
      .finally(closeModal)
  }

  let text = {
    type: 'Редактирование',
    save: 'Сохранить'
  }

  if (typeof event.id != 'number') {
    text.type = 'Создание'
    text.save = 'Создать'
  }

  const [teachers] = useRepository(PeopleModel, {
    where: { isTeacher: true }
  })

  const [childs] = useRepository(PeopleModel, {
    where: { isTeacher: false }
  })

  return (
    <Form title={`${text.type} мероприятия`}>
      <SelectInput
        name="Уровень"
        target={event}
        prop="level"
        data={EventModel.levels} />

      <TextInput
        name="Название"
        target={event}
        prop="name" />

      <TextAreaInput
        name="Описание"
        target={event}
        prop="description" />

      <DateInput
        name="Дата начала"
        target={event}
        prop="startDate" />

      <DateInput
        name="Дата конца"
        target={event}
        prop="endDate" />

      <SelectInput
        name="Руководитель"
        target={event}
        prop="maker"
        data={teachers.map(e => ({ name: e.fullName, value: e }))} />
      <button onClick={save}>{text.save}</button>
    </Form>
  )
}