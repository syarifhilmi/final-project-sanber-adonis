import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OwnerRole {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    let role = auth.user?.role
    if (role == 'owner') {
      await next()
    }
    else {
      console.log(role)
      return response.unauthorized({ message: 'Anda harus menjadi owner' })
    }
  }
}
