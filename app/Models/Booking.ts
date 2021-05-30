import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Field from './Field'
import User from './User'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public play_start: DateTime

  @column()
  public play_end: DateTime

  @column()
  public fields_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>

  @manyToMany(() => User)
  public user: ManyToMany<typeof User>
}
