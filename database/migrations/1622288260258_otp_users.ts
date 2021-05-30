import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OtpUsers extends BaseSchema {
  protected tableName = 'otp_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('otp').notNullable()
      table.integer('users_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
