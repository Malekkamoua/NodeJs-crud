/** @format */

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../server')

var url = '/test/teachers/'

const teacher_id = '60c8f4970472a62ee48e0e05'
const pfe = {
	id: '60c983f92e0a8a1b808d93ed',
	title: 'PFE test teacher',
	status: false,
}

describe('Teacher actions', function () {
	beforeAll(async function (done) {
		mongoose.connect(
			'mongodb+srv://admin:FQGpQ7SYGFvbQ4Po@mernpfe.utapc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
			{useNewUrlParser: true, useUnifiedTopology: true},
			() => done()
		)
	})

	let token

	beforeAll(async function (done) {
		await supertest(app)
			.post('/login')
			.send({
				email: 'teacher@gmail.com',
				password: 'Hello',
			})
			.expect(200)
			.then(async (response) => {
				expect(response.body.userInformation.name).toBe('Teacher Teacher')
				token = response.body.token
				done()
			})
	})
	test(' Get my pfes ', async () => {
		await supertest(app)
			.get(url + '/pfe/teacher/' + teacher_id)
			.set('Authorization', `Bearer ${token}`)
			.then(async (response) => {
				expect(response.statusCode).toBe(200)
			})
	})

	test(' Get all pfes ', async () => {
		await supertest(app)
			.get(url + '/all')
			.set('Authorization', `Bearer ${token}`)
			.then(async (response) => {
				expect(response.statusCode).toBe(200)
			})
	})

	test(' Accept pfe ', async () => {
		await supertest(app)
			.post(url + '/accept/' + pfe.id)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(async (response) => {
				expect(response.body.Newpfe._id).toBeTruthy()
				expect(response.body.Newpfe.status).toBe(true)
			})
	})

	afterAll((done) => {
		mongoose.connection.close()
		done()
	})
})
