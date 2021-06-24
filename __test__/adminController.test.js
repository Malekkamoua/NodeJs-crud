/** @format */

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../server')

var url = '/test/admin/students/'

var add_object = {
	name: 'Test student',
	cin: '14765828',
	email: 'test@gmail.com',
	password: 'test',
	tel: '2020156586',
	age: '24',
	sexe: 'f',
}

var fetched_object = {
	id: '60c9aa717c6f953624928ab3',
	name: 'Test student',
	cin: '14765828',
	email: 'test@gmail.com',
	password: 'test',
	tel: '2020156586',
	age: '24',
	sexe: 'f',
}

var update_object = {
	name: 'malek skander',
	cin: '14765888',
}

describe('Add student', () => {
	beforeAll(async function (done) {
		mongoose.connect(
			'mongodb+srv://admin:FQGpQ7SYGFvbQ4Po@mernpfe.utapc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
			{useNewUrlParser: true, useUnifiedTopology: true},
			() => done()
		)
	})
	test(' POST ', async () => {
		await supertest(app)
			.post(url)
			.send(add_object)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBeTruthy()
				expect(response.body.name).toBe(add_object.name)
				expect(response.body.email).toBe(add_object.email)
			})
	})
})

describe('Test', function () {
	beforeAll(async function (done) {
		mongoose.connect(
			'mongodb+srv://admin:FQGpQ7SYGFvbQ4Po@mernpfe.utapc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
			{useNewUrlParser: true, useUnifiedTopology: true},
			() => done()
		)
	})

	test('GET BY ID', async () => {
		await supertest(app)
			.get(url + fetched_object.id)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBeTruthy()
				expect(response.body.name).toBe(fetched_object.name)
				expect(response.body.email).toBe(fetched_object.email)
			})
	})

	test(' PUT ', async () => {
		await supertest(app)
			.put(url + fetched_object.id)
			.send(update_object)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBeTruthy()
				expect(response.body.name).toBe(update_object.name)
				expect(response.body.cin).toBe(update_object.cin)
			})
	})

	test('DELETE BY ID', async () => {
		await supertest(app)
			.delete(url + fetched_object.id)
			.expect(200)
			.then(async (response) => {
				expect(response.body._id).toBeFalsy()
			})
	})

	afterAll((done) => {
		mongoose.connection.close()
		done()
	})
})
