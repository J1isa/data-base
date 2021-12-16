import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AchivmentModel } from "./Achivment";
import { ClassGroupModel } from "./ClassGroup";
import { EntityModel } from "./Entity";
import { EventModel } from "./Event";

@Entity()
export class PeopleModel extends EntityModel {
  @Column('text')
  firstName: string

  @Column('text')
  secondName: string

  @Column('text')
  lastName: string

  @Column('date')
  birthday: Date

  @Column('boolean')
  isTeacher = false

  get name() {
    return [
      this.secondName,
      this.firstName
    ].join(' ')
  }

  get fullName() {
    return [
      this.secondName,
      this.firstName.substr(0, 1) + '.',
      this.lastName.substr(0, 1) + '.'
    ].join(' ')
  }

  @OneToOne(() => ClassGroupModel, c => c.controll)
  ownClassGroup: ClassGroupModel

  @ManyToOne(() => ClassGroupModel, c => c.childs)
  classGroup: ClassGroupModel

  @OneToMany(() => AchivmentModel, a => a.from)
  takeAchivments: AchivmentModel[]

  @OneToMany(() => AchivmentModel, a => a.target)
  haveAchivments: AchivmentModel[]

  @OneToMany(() => EventModel, e => e.maker)
  makeEvents: EventModel[]

  // @ManyToMany(() => EventModel, e => e.members)
  // eventMembers: EventModel[]
}