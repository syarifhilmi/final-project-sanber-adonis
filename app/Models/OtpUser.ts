import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class OtpUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public otp: string

  @column()
  public users_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
