import { ClassGroupModel } from "model/ClassGroup";
import { PeopleModel } from "model/People";
import { EventModel } from "model/Event";
import { AchivmentModel } from "model/Achivment";
import { createConnection } from "typeorm";

export const awaitConnection = createConnection({
  type: 'sqlite',
  database: './data/db.sqlite',
  synchronize: true,
  cache: true,
  entities: [
    ClassGroupModel,
    PeopleModel,
    EventModel,
    AchivmentModel,
  ]
})