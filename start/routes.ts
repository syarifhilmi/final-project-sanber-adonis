/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { message: 'server is connected' }
})

//Auth
Route.post('/register', 'AuthController.register').as('auth.register')
Route.post('/otp-confirmation', 'AuthController.otpConfirmation').as('auth.otpConfirmation')
Route.post('/login', 'AuthController.login').as('auth.login')

//Venue
Route.resource('venues', 'VenuesController').except(['create', 'destroy', 'edit']).apiOnly().middleware({ 'store': ['auth', 'owner'], 'update': ['auth', 'owner'], 'index': ['auth', 'owner'] })
Route.post('/venues/:id/fields', 'VenuesController.fields').as('venues.fields').middleware(['auth', 'owner'])
Route.post('/venues/:id/bookings', 'VenuesController.bookings').as('venues.bookings').middleware('auth')

//Booking
Route.resource('bookings', 'BookingsController').only(['index', 'show']).apiOnly().middleware({ '*': 'auth' })
Route.get('/schedules', 'BookingsController.schedules').middleware('auth').as('bookings.schedules')
Route.put('/bookings/:id/unjoin', 'BookingsController.unjoin').middleware('auth').as('bookings.unjoin')
Route.put('/bookings/:id/join', 'BookingsController.join').middleware('auth').as('bookings.join')

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})