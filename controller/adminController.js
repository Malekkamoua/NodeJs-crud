/** @format */

const Student = require('../models/Student')

function init(collectionName, urlServer, schemaParam) {
	const mongoose = require('mongoose')
	mongoose.connect(urlServer, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})

	const db = mongoose.connection
	db.on('error', (error) => console.error(error))
	db.once('open', () => console.log('Connected to database ------'))

	var express = require('express')
	var router = express.Router()

	// Middleware that is specific to this router
	router.use(function timeLog(req, res, next) {
		console.log('Time: ', Date.now())
		next()
	})

	const schema = new mongoose.Schema(schemaParam)
	const model = mongoose.model(collectionName, schema)

	router.post('/', function (req, res) {
		const document = new model(req.body)

		document.save(function (err, doc) {
			if (err) {
				return res.status(500).send(err)
			} else {
				console.log("l'ajout d'un document est réussi.")
				return res.status(200).send(doc)
			}
		})
	})

	router.put('/:id', async function (req, res) {
		let id = req.params.id
		const filter = {
			_id: id,
		}

		const updateObject = req.body

		try {
			let updatedObject = await model.findOneAndUpdate(filter, updateObject, {
				new: true,
			})
			return res.status(200).send(updatedObject)
		} catch (err) {
			return res.status(500).send(err)
		}
	})

	router.get('/', async function (req, res) {
		if (collectionName === 'students') {
			const students = await model.find().populate('tutor pfe year')
			res.send(students)
		} else {
			model.find(function (err, response) {
				if (err) {
					res.send(err)
				} else {
					res.send(response)
				}
			})
		}
	})

	router.delete('/:id', async function (req, res) {
		let id = req.params.id
		const filter = {
			_id: id,
		}

		model.findOneAndDelete(filter, function (err, docs) {
			if (err) {
				return res.status(500).json({
					message: `${err}`,
				})
			} else {
				return res.status(200).json({
					message: `Deleted ${model} ${docs}`,
				})
			}
		})
	})

	router.get('/:id', async (req, res) => {
		try {
			const obj = await model.findOne({_id: req.params.id})
			res.send(obj)
		} catch {
			res.status(404)
			res.send({error: "obj doesn't exist!"})
		}
	})

	//Ban Student
	router.put('/banning/:id', async (req, res) => {
		const student = await Student.findOne({_id: req.params.id})
		let status = !student.isBanned

		student.update(
			{$set: {isBanned: status}, new: true},
			function (err, studentUpdated) {
				if (err) {
					return res.status(404).send(err)
				} else {
					return res.status(200).send(studentUpdated)
				}
			}
		)
	})

	return router
}

module.exports = init
