/** @format */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
	name: {
		type: String,
		//Required: [true, "name is required for user"],
	},
	cin: {
		type: String,
		//Required: [true, "cin is required for user"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'email is required for user'],
	},
	password: {
		type: String,
		required: [true, 'password is required for user'],
	},
	avatar: {
		type: String,
		default: 'image',
	},
	role: {
		type: String,
		enum: ['teacher', 'admin'],
		default: 'teacher',
	},
	tel: {
		type: String,
		//Required: [true, "tel is required for user"],
	},
	age: {
		type: String,
		// Required: [true, "age is required for user"],
	},
	sexe: {
		type: String,
		//Required: [true, "sexe is required for user"],
	},
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	//Bcrypt libary is used to encrypt the password
	this.password = await bcrypt.hash(this.password, 12)
	next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
