import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Database from "@ioc:Adonis/Lucid/Database";
import Booking from "App/Models/Booking";

export default class BookingsController {
    public async show({ response, params }: HttpContextContract) {
        try {
            const booking = await Database.from('users_has_bookings').where('users_has_bookings.booking_id', params.id)
            const user = await Database.from('users').innerJoin('users_has_bookings', 'users.id', '=', 'users_has_bookings.user_id').where('users_has_bookings.booking_id', params.id).select('users.*')
            return response.status(200).json({ booking, join: user })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async index({ response }: HttpContextContract) {
        try {
            const booking = await Booking.all()
            return response.status(200).json({ booking })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async schedules({ response, auth }: HttpContextContract) {
        try {
            const id = auth.user?.id
            const schedule = await Database.from('bookings').innerJoin('users_has_bookings', 'booking_id', '=', 'bookings.id').where('users_has_bookings.user_id', id!).select('bookings.*')
            return response.status(200).json({ schedule })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async unjoin({ params, response, auth }: HttpContextContract) {
        try {
            const id = auth.user?.id
            await Database.from('users_has_bookings').where('users_has_bookings.booking_id', params.id).andWhere('users_has_bookings.user_id', id!).delete()
            return response.created({ message: 'Berhasil unjoin dari booking' })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async join({ params, response, auth }: HttpContextContract) {
        try {
            const user_id = auth.user?.id
            await Database.table('users_has_bookings').insert({ user_id, booking_id: params.id })
            return response.created({ message: 'Berhasil join booking' })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }
}
