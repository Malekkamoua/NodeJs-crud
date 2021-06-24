/** @format */

const dotenv = require('dotenv')
dotenv.config()

const router = require('express').Router()
const Pfe_student = require('../models/Pfe_student')
const Student = require('../models/Student')

router.get('/all', async function (req, res) {
	try {
		const listpfe = await Pfe_student.find().populate('student tutor year')
		res.send(listpfe)
	} catch (err) {
		res.send(err)
	}
})
router.get('/pfe', async function (req, res) {
	const pfes = await Pfe_student.find({status: 0}).populate(
		'tutor student year'
	)
	res.send(pfes)
})
router.get('/pfe/teacher/:id', async function (req, res) {
	try {
		const {id} = req.params
		console.log('hello im the id', id)
		const listPfeByTeacher = await Pfe_student.find({tutor: id}).populate(
			'student tutor year'
		)

		res.json({status: 200, message: 'received all data', listPfeByTeacher})
	} catch (err) {
		res.json({status: 404, message: err.message})
	}
})

router.get('/pfe/:id', async (req, res) => {
	try {
		const pfe = await Pfe_student.find({
			_id: req.params.id,
		}).populate('student tutor year')

		if (pfe != null) {
			res.send(pfe)
		} else {
			res.status(404).json({
				message: 'Student has no pfe',
			})
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
})

router.post('/accept/:id', async function (req, res) {
	try {
		const {tutorId} = req.body

		var today = new Date()

		var date =
			today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
		const pfe = await Pfe_student.findByIdAndUpdate(
			req.params.id,
			{status: true, acceptationDate: date, tutor: tutorId},
			{
				new: true,
				runValidators: true,
			}
		)
		await Student.findByIdAndUpdate(
			pfe.student,
			{tutor: tutorId},
			{
				new: true,
				runValidators: true,
			}
		)
		res.status(200).json({
			Status: 'success',
			Newpfe: pfe,
		})
	} catch (err) {
		res.status(404).json({
			Status: 'error',
		})
	}
})
router.post('/undo/:id', async function (req, res) {
	try {
		console.log('teacher is trying to undo')
		// Const { tutorId } = req.body;

		// Console.log(req.params.id);

		// Var today = new Date();

		// Var date =
		//   Today.getFullYear() +
		//   "-" +
		//   (today.getMonth() + 1) +
		//   "-" +
		//   Today.getDate();
		const pfe = await Pfe_student.findByIdAndUpdate(
			req.params.id,
			{status: false, $unset: {acceptationDate: '', tutor: ''}},
			{
				new: true,
				runValidators: true,
			}
		)
		await Student.findByIdAndUpdate(
			pfe.student,
			{$unset: {tutor}},
			{
				new: true,
				runValidators: true,
			}
		)
		res.status(200).json({
			Status: 'success',
			Newpfe: pfe,
		})
	} catch (err) {
		res.status(404).json({
			Status: 'error',
		})
	}
})

module.exports = router
