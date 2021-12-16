import { ListValues } from "lib/listValues";
import { Column, Entity, JoinColumn, JoinTable } from "typeorm";
import { ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { AchivmentModel } from "./Achivment";
import { EntityModel } from "./Entity";
import { PeopleModel } from "./People";

const levels = new ListValues([
  {name: 'Муниципальный', value: 1},
  {name: 'Областной', value: 2},
  {name: 'Региональный', value: 3},
  {name: 'Окружной', value: 4},
  {name: 'Всероссийский', value: 5},
  {name: 'Международный', value: 6}
])

@Entity()
export class EventModel extends EntityModel {
  static levels = levels

  @Column('text')
  name: string

  @Column('int')
  level: number

  @Column('text')
  description: string

  @Column('date')
  startDate: Date

  @Column('date')
  endDate: Date

  @ManyToOne(() => PeopleModel, p => p.makeEvents)
  maker: PeopleModel

  @OneToMany(() => AchivmentModel, a => a.event)
  achivments: AchivmentModel[]
}