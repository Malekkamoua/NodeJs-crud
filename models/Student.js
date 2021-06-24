/** @format */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const studentSchema = mongoose.Schema({
	name: {
		type: String,
		//Required: [true, "name is required for Student"],
	},
	cin: {
		type: String,
		//Required: [true, "cin is required for Student"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'email is required for Student'],
	},
	password: {
		type: String,
		required: [true, 'password is required for Student'],
	},
	avatar: {
		type: String,
		default: 'image',
	},
	tel: {
		type: String,
		// Required: [true, "tel is required for Student"],
	},
	age: {
		type: String,
		// Required: [true, "age is required for Student"],
	},
	sexe: {
		type: String,
		// Required: [true, "sexe is required for Student"],
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
	hasPfe: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		default: 'student',
	},
	pfe: {type: mongoose.Schema.Types.ObjectId, ref: 'PfeStudent'},
	tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})
studentSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	//Bcrypt libary is used to encrypt the password
	this.password = await bcrypt.hash(this.password, 12)
	next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
