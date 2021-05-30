import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersHasBookings extends BaseSchema {
  protected tableName = 'users_has_bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('users.id')
      table.integer('booking_id').unsigned().references('bookings.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
