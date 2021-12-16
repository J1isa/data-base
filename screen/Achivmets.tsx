import React from "preact/compat";

import { AchivmentModel } from "model/Achivment";
import { makeTable } from "view/Table";
import { useRepository } from "lib/useRepository";
import { Form, TextInput, SelectInput } from "view/Form";
import { closeModal, modalConfirm, setModal } from "view/Modal";
import { EventModel } from "model/Event";
import { PeopleModel } from "model/People";

const AchivmentsTable = makeTable(AchivmentModel, [
  { title: 'ID', value: ({ id }) => id },
  { title: 'Уровень', value: ({ event }) => EventModel.levels.getName(event?.level) },
  { title: 'Событие', value: ({ event }) => event?.name },
  { title: 'Награда', value: ({ name }) => name },
  { title: 'Дата мероприятия', value: ({ event }) => event?.startDate },
  { title: 'Ученик', value: ({ target }) => target?.name },
  { title: 'Класс', value: ({ target }) => target?.classGroup?.name },
  { title: 'Учитель', value: ({ from }) => from?.fullName },
  { value: 'Изменить', keyClick: 'edit' },
  { value: 'Удалить', keyClick: 'delete' }
])

export const Achivments = () => {
  const [data] = useRepository(AchivmentModel, {
    relationsFunc: [
      e => e.event,
      e => e.from,
      e => e.target,
      e => e.target.classGroup,
    ]
  })

  return (
    <div className={'content'}>
      <div className="buttons">
        <button onClick={() => setModal(<EditAchivment />)}>+</button>
      </div>
      <AchivmentsTable onClick={
        (key, item) => {
          switch (key) {
            case 'delete': {
              modalConfirm('Удалить выбранный элемент?')
                .then(e => e && item.remove())
                .catch(console.error)
            } break

            case 'edit': {
              setModal(<EditAchivment achivment={item} />)
            } break
          }
        }
      } data={data} />
    </div>
  )
}

const EditAchivment = ({ achivment = new AchivmentModel }) => {
  const [events] = useRepository(EventModel)
  const [teachers] = useRepository(PeopleModel, { where: { isTeacher: true } })
  const [childs] = useRepository(PeopleModel, { where: { isTeacher: false } })

  const save = () => {
    achivment.save()
      .catch(console.error)
      .finally(closeModal)
  }

  let text = {
    type: 'Редактирование',
    save: 'Сохранить'
  }

  if (typeof achivment.id != 'number') {
    text.type = 'Создание'
    text.save = 'Создать'
  }

  return (
    <Form title={`${text.type} награды`}>
      <SelectInput
        name="Мероприятие"
        target={achivment}
        prop="event"
        data={events.map(e => ({ name: e.name, value: e }))} />

      <TextInput
        name="Награда"
        target={achivment}
        prop="name" />


      <SelectInput
        name="Выдал"
        target={achivment}
        prop="from"
        data={teachers.map(e => ({ name: e.fullName, value: e }))} />

      <SelectInput
        name="Получил"
        target={achivment}
        prop="target"
        data={childs.map(e => ({ name: e.name, value: e }))} />

      <button onClick={save}>{text.save}</button>
    </Form>
  )
}