import { ListValues } from "lib/listValues";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityModel } from "./Entity"
import { PeopleModel } from "./People";

const levels = new ListValues([
  {name: '1', value: 1},
  {name: '2', value: 2},
  {name: '3', value: 3},
  {name: '4', value: 4},
  {name: '5', value: 5},
  {name: '6', value: 6},
  {name: '7', value: 7},
  {name: '8', value: 8},
  {name: '9', value: 9},
  {name: '10', value: 10},
  {name: '11', value: 11}
])

const subLevels = new ListValues([
  {name: 'А', value: 1},
  {name: 'Б', value: 2},
  {name: 'В', value: 3},
  {name: 'Г', value: 4},
  {name: 'Д', value: 5},
  {name: 'E', value: 6}
])

@Entity()
export class ClassGroupModel extends EntityModel {
  static levels = levels
  static subLevels = subLevels

  @Column('int')
  level: number

  @Column('int')
  subLevel: number

  @OneToOne(() => PeopleModel, p => p.ownClassGroup)
  @JoinColumn()
  controll: PeopleModel

  @OneToMany(() => PeopleModel, p => p.classGroup)
  childs: PeopleModel[]

  get name() {
    return [
      levels.getName(this.level),
      subLevels.getName(this.subLevel)
    ].join(' ')
  }

  toString() {
    return this.name
  }
}