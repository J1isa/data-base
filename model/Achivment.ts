import { Column, Entity, ManyToOne } from "typeorm";
import { EntityModel } from "./Entity";
import { EventModel } from "./Event";
import { PeopleModel } from "./People";

@Entity()
export class AchivmentModel extends EntityModel {
  @Column('text')
  name: string

  @ManyToOne(() => PeopleModel, p => p.takeAchivments)
  from: PeopleModel

  @ManyToOne(() => PeopleModel, p => p.haveAchivments)
  target: PeopleModel

  @ManyToOne(() => EventModel, e => e.achivments)
  event: EventModel 
}