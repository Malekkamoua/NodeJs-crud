/** @format */

const mongoose = require('mongoose')
const uniYearSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'title is required for university year'],
	},
	startDate: {
		type: Date,
		required: [true, 'start date is required for university year'],
	},
	endDate: {
		type: Date,
		required: [true, 'end date is required for university year'],
	},
})
const UniYear = mongoose.model('UniYear', uniYearSchema)

module.exports = UniYear
