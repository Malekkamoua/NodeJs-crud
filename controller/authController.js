/** @format */

const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Student = require('../models/Student')
const bcrypt = require('bcrypt')
dotenv.config()

const signToken = (id, role) => {
	return jwt.sign({id: id, role: role}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_IN,
	})
}
const correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

exports.changePassword = async (req, res) => {
	console.log(req.body)
	const {oldPassword, newPassword, role} = req.body
	// Check if the password are different
	if (oldPassword !== newPassword) {
		console.log(req.params)
		let currentUser
		//Get the user if he is student or user and check his password if it is correct
		if (role === 'student') currentUser = await Student.findById(req.params.id)
		if (role === 'teacher') currentUser = await User.findById(req.params.id)
		if (!currentUser) {
			return res.json({status: 401, message: 'Mot de passe incorrect'})
		} else {
			if (!(await correctPassword(oldPassword, currentUser.password))) {
				return res.json({
					status: 401,
					message: 'Mot de passe incorrect',
				})
			}
		}
		let updatedUser
		let bcryptNewPassword = await bcrypt.hash(newPassword, 12)
		//Update the password
		if (role === 'student')
			updatedUser = await Student.findByIdAndUpdate(req.params.id, {
				password: bcryptNewPassword,
			})
		if (role === 'teacher')
			updatedUser = await User.findByIdAndUpdate(req.params.id, {
				password: bcryptNewPassword,
			})
		return res.json({status: 200, message: 'Mot de passe mis à jour'})
	} else {
		return res.json({
			status: 404,
			message:
				'Le nouveau mot de passe entré est identique à votre dernier mot de passe',
		})
	}
}
exports.login = async (req, res) => {
	const {email, password} = req.body
	console.log(email, password)
	//Check email and password exist
	if (!email || !password) {
		return res.status(401).json({
			status: 401,
			message: 'Taper un email et un mot de passe svp',
		})
	}
	//Check if user exists & password is correct
	let user = await User.findOne({email}).select('+password')
	//Console.log(user);
	const studentUser = await Student.findOne({email}).select('+password')
	//Console.log(studentUser);

	try {
		if (studentUser) {
			user = studentUser
		}
		if (!user) {
			return res.json({
				status: 401,
				message: 'Email ou mot de passe incorrect',
			})
		} else {
			if (!(await correctPassword(password, user.password))) {
				return res.json({
					status: 401,
					message: 'Email ou mot de passe incorrect',
				})
			}
		}
		if (user.isBanned === true) {
			return res.json({
				status: 401,
				message: 'Vous êtes bloqué.',
			})
		}
		//Console.log(process.env.JWT_SECRET);
		//Console.log(user);
		const token = signToken(user._id, user.role)
		res.send({
			status: 200,
			token,
			userInformation: user,
		})
	} catch (e) {
		console.log(e)
	}
}

exports.protect = async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	)
		token = req.headers.authorization.split(' ')[1]
	//Console.log("i m the token" + token);
	if (!token)
		return res.status(401).json({
			status: 401,
			message: "Vous n'êtes pas connecté, connectez vous svp.",
		})
	//Token verification:
	let verified
	try {
		verified = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		return res.status(401).json({
			status: 401,
			message: 'The token belonging to this token is no longer exist',
		})
	}

	//Console.log("im the verified" + verified.role);
	let currentUser
	if (verified.role == 'student') {
		currentUser = await Student.findById(verified.id)
	}
	if (verified.role == 'teacher' || verified.role == 'admin') {
		currentUser = await User.findById(verified.id)
	}
	//Console.log(currentUser);
	req.user = currentUser

	next()
}

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return res.status(401).json({
				status: 401,
				message: "Vous n'avez pas la permission",
			})
		next()
	}
}
