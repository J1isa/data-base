import EventEmitter from "events";
import { PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { BeforeUpdate, AfterUpdate, AfterRemove, AfterInsert } from "typeorm";

export class EntityModel extends BaseEntity {
  static events = new EventEmitter()

  @PrimaryGeneratedColumn()
  id: number

  @Column('date')
  created = new Date()

  @Column('date')
  updated = new Date()

  equal(b: this) {
    return this.id == b.id
  }

  save() {
    const isUpdate = this.hasId()

    return super.save()
      .then(e => (isUpdate && this._update(), e))
  }

  @BeforeUpdate()
  private _updateTime() {
    this.updated = new Date()
  }

  @AfterUpdate()
  private _update(...args) {
    console.log('Update')
    ;(this['constructor'] as any)
      .events.emit('change', ...args)
  }

  @AfterRemove()
  private _remove(...args) {
    console.log('Remove')
    ;(this['constructor'] as any)
      .events.emit('change', ...args)
  }

  @AfterInsert()
  private _insert(...args) {
    console.log('Insert')
    ;(this['constructor'] as any)
      .events.emit('change', ...args)
  }
}