import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from "@ioc:Adonis/Lucid/Database";
import Booking from "App/Models/Booking";
import Field from "App/Models/Field";
import Venue from "App/Models/Venue";

export default class VenuesController {
    public async store({ request, response, auth }: HttpContextContract) {
        try {
            const venueSchema = schema.create({
                name: schema.string(),
                phone: schema.string(),
                address: schema.string()
            })
            await request.validate({ schema: venueSchema })

            let id = auth.user?.id
            const name = request.input('name')
            const phone = request.input('phone')
            const address = request.input('address')
            const users_id = id

            await Venue.create({ name, phone, address, users_id })
            return response.created({ message: 'Venue berhasil disimpan' })

        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async show({ response, params }: HttpContextContract) {
        try {
            let today = new Date()
            const date = today.getDate()
            const venue = await Database.from('venues').where('venues.id', params.id)
            const field = await Database.from('venues').innerJoin('fields', 'venues.id', '=', 'fields.venues_id').where('venues.id', params.id).select('fields.*')
            const schedule = await Database.from('fields').innerJoin('venues', 'fields.venues_id', '=', 'venues.id').innerJoin('bookings', 'fields.id', '=', 'bookings.fields_id').where('venues.id', params.id).andWhere('bookings.play_start', date).select('bookings.*')
            return response.status(200).json({ venue, field, schedule })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async index({ response }: HttpContextContract) {
        try {
            const venue = await Venue.all()
            return response.status(200).json({ venue })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }


    public async update({ request, response, params }: HttpContextContract) {
        try {

            const venue = await Venue.findOrFail(params.id)
            venue.name = request.input('name')
            venue.phone = request.input('phone')
            venue.address = request.input('address')
            await venue.save()

            return response.created({ message: 'Perubahan venue berhasil disimpan' })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async fields({ request, response, params }: HttpContextContract) {
        try {
            const name = request.input('name')
            const type = request.input('type')
            const venues_id = params.id
            await Field.create({ name, type, venues_id })
            return response.created({ message: 'Field berhasil disimpan' })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }

    public async bookings({ request, response, params, auth }: HttpContextContract) {
        try {
            const user_id = auth.user?.id
            const play_start = request.input('play_start')
            const play_end = request.input('play_end')
            const fields_id = request.input('fields_id')
            await Database.from('venues').innerJoin('fields', 'venues.id', '=', 'fields.venues_id').where('venues.id', params.id).andWhere('fields.id', fields_id).select('fields.*')
            const booking = await Booking.create({ play_start, play_end, fields_id })
            await Database.table('users_has_bookings').insert({ user_id, booking_id: booking.id })
            return response.created({ message: 'Booking berhasil disimpan' })
        }
        catch (error) {
            return response.badRequest({ message: error.message })
        }
    }
}
