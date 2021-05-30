import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Venue from './Venue'
import Booking from './Booking'
import Hash from '@ioc:Adonis/Core/Hash'
import OtpUser from './OtpUser'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: string

  @column()
  public validation: boolean

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Venue)
  public venue: HasMany<typeof Venue>

  @manyToMany(() => Booking)
  public booking: ManyToMany<typeof Booking>

  @hasOne(() => OtpUser)
  public otpUser: HasOne<typeof OtpUser>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
