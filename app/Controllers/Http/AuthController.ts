import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import OtpUser from 'App/Models/OtpUser'
import UserValidator from '../../Validators/UserValidator'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        try {
            const data = await request.validate(UserValidator)
            const insertUser = await User.create(data)
            const otpCode = Math.floor(100000 + Math.random() * 900000)
            await Mail.sendLater((message) => {
                message
                    .from('admin@mainbersama.com')
                    .to(data.email)
                    .subject('Validasi Ragistrasi Main Bersama')
                    .htmlView('emails/otp_verif', { otpCode })
            })
            await OtpUser.create({ users_id: insertUser.id, otp: otpCode.toString() })
            return response.created({ message: 'Register berhasil, harap verifikasi lewat kode yang dikirim di e-mail' })
        }
        catch (error) {
            return response.unprocessableEntity({ message: error.message })
        }
    }

    public async otpConfirmation({ request, response }: HttpContextContract) {
        try {
            let otpCode = request.input('otp_code')
            let email = request.input('email')

            let user = await User.findBy('email', email)
            await OtpUser.findBy('otp', otpCode)
            user!.validation = true
            await user!.save()
            return response.status(200).json({ message: 'Berhasil konfirmasi OTP' })
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        try {

            const userSchema = schema.create({
                email: schema.string(),
                password: schema.string()
            })

            await request.validate({ schema: userSchema })
            const email = request.input('email')
            const password = request.input('password')

            const token = await auth.use('api').attempt(email, password)

            return response.ok({ message: 'Berhasil login', token })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }
}

