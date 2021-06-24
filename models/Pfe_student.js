/** @format */

const mongoose = require('mongoose')
const User = require('./User')
const Student = require('./Student')
const UniYear = require('./Uni_year')

const pfeStudentSchema = mongoose.Schema({
	pdf: {
		type: String,
		default: 'none',
	},
	title: {
		type: String,
		default: 'none',
	},
	content: {
		type: String,
		default: 'none',
		min: 100,
	},
	status: {
		type: Boolean,
		default: false,
	},
	acceptationDate: {
		type: Date,
		//Required: [true, "acceptation date is required for Student"]
	},
	tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
	year: {type: mongoose.Schema.Types.ObjectId, ref: 'UniYear'},
	// TutorId: {
	//   Type: String,
	//   Default: "",
	// },
	// StudentId: {
	//   Type: String,
	//   Default: "",
	// },
})

const PfeStudent = mongoose.model('PfeStudent', pfeStudentSchema)
module.exports = PfeStudent
