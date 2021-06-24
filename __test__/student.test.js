/** @format */

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../server')

var url = '/test/students/'

const user = {
	_id: '60c9200e1791eb01a856c0fc',
}

const add_object = {
	title: 'PFe Test Object',
	content: 'PFE content test',
	acceptationDate: '2021-05-14T23:00:00.000+00:00',
	student: '60c9200e1791eb01a856c0fc',
}

const fetched_object = {
	id: '',
	title: 'PFE test',
	content: 'PFE content test',
	acceptationDate: '2021-05-14T23:00:00.000+00:00',
	student: '60c9200e1791eb01a856c0fc',
}

describe('Add PFE', () => {
	beforeAll(async function (done) {
		mongoose.connect(
			'mongodb+srv://admin:FQGpQ7SYGFvbQ4Po@mernpfe.utapc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
			{useNewUrlParser: true, useUnifiedTopology: true},
			() => done()
		)
	})

	beforeAll(async function (done) {
		await supertest(app)
			.post('/login')
			.send({
				email: 'testing@gmail.com',
				password: 'test',
			})
			.expect(200)
			.then(async (response) => {
				expect(response.body.userInformation.name).toBe('Testing student')
				token = response.body.token // Save the token!
				done()
			})
	})

	test(' Add pfe ', async () => {
		await supertest(app)
			.post(url + '/pfe')
			.set('Authorization', `Bearer ${token}`)
			.send(add_object)
			.expect(200)
			.then(async (response) => {
				expect(response.body.student).toBe(add_object.student)
				expect(response.body.title).toBe(add_object.title)
				expect(response.body.content).toBe(add_object.content)
			})
	})
})

describe('Student actions', function () {
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
				email: 'testing@gmail.com',
				password: 'test',
			})
			.expect(200)
			.then(async (response) => {
				expect(response.body.userInformation.name).toBe('Testing student')
				token = response.body.token // Save the token!
				done()
			})
	})

	test(' Get profile ', async () => {
		await supertest(app)
			.get(url + 'profile')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBe(user._id)
			})
	})

	test(' Update profile ', async () => {
		const updatedObject = {
			name: 'Updated name',
			cin: '152269885',
		}
		await supertest(app)
			.put(url + 'profile')
			.set('Authorization', `Bearer ${token}`)
			.send(updatedObject)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBe(user._id)
				expect(response.body.name).toBe(updatedObject.name)
				expect(response.body.cin).toBe(updatedObject.cin)
			})
	})

	test(' Update pfe ', async () => {
		const updatedObject = {
			title: 'PFE title',
			content: 'PFE content',
		}

		await supertest(app)
			.put(url + '/pfe/' + fetched_object.id)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedObject)
			.expect(200)
			.then(async (response) => {
				expect(response.body.student).toBe(user._id)
				expect(response.body.title).toBe(update_object.title)
				expect(response.body.content).toBe(update_object.content)
			})
	})

	test('Get pfe by id', async () => {
		await supertest(app)
			.get(url + '/pfe/' + fetched_object.id)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBe(fetched_object.id)
				expect(response.body.student).toBe(fetched_object.student)
				expect(response.body.title).toBe(fetched_object.title)
			})
	})

	test('Get pfe by student id', async () => {
		await supertest(app)
			.get(url + '/pfe/student/' + fetched_object.student)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(async (response) => {
				expect(response.body.student).toBe(fetched_object.student)
			})
	})

	afterAll((done) => {
		mongoose.connection.close()
		done()
	})
})
