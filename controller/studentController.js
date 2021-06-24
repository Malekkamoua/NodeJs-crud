/** @format */

const dotenv = require('dotenv')
dotenv.config()
const Student = require('../models/Student')
const router = require('express').Router()
const Pfe_student = require('../models/Pfe_student')
const Uniyear = require('../models/Uni_year')

router.get('/profile', async (req, res) => {
	try {
		const user = await Student.findById(req.user._id)
		res.status(200).send(user)
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
})
router.put('/profile', async (req, res) => {
	const filter = {
		_id: req.user.id,
	}
	const updateObject = req.body

	try {
		let updatedObject = await Student.findOneAndUpdate(filter, updateObject)
		return res.status(200).send(updatedObject)
	} catch (err) {
		return res.status(500).send(err)
	}
})

router.post('/pfe', async function (req, res) {
	//Send Student object in request + hasPfe = true
	const anneecurrent = await Uniyear.findOne({}).sort({startDate: -1})
	// Console.log(anneecurrent);
	req.body = {...req.body, year: anneecurrent}

	const document = new Pfe_student(req.body).populate('tutor student year')
	await Student.findByIdAndUpdate(req.body.student, {pfe: document._id})
	console.log(document)
	document.save(function (err) {
		if (err) {
			Res.send(err)
		} else {
			return res.status(200).json({data: document})
		}
	})
})

//Get pfe by id
router.get('/pfe/:id', async (req, res) => {
	try {
		const pfe = await Pfe_student.find({
			_id: req.params.id,
		}).populate('student tutor year')

		if (pfe != null) {
			res.json(pfe)
		} else {
			res.status(200).json({
				message: 'Student has no pfe',
			})
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
})

//Get pfe by student id
router.get('/pfe/student/:id', async function (req, res) {
	try {
		const {id} = req.params
		const listPfeByStudent = await Pfe_student.find({studentId: id})
		res.json({status: 200, listPfeByStudent})
	} catch (err) {
		res.json({status: 404, message: err.message})
	}
})

router.put('/pfe/:id', async (req, res) => {
	const filter = {
		_id: req.params.id,
	}
	const updateObject = req.body

	try {
		let updatedObject = await Pfe_student.findOneAndUpdate(filter, updateObject)
		res.status(200).send(updatedObject)
	} catch (err) {
		res.status(500).send(err)
	}
})

module.exports = router
