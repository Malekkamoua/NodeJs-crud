/** @format */

const express = require('express')
const app = require('./app')
const dotenv = require('dotenv')
const {login, changePassword} = require('./controller/authController')
dotenv.config()
const path = require('path')
const User = require('./models/User')
const Student = require('./models/Student')
const Uni_year = require('./models/Uni_year')

const adminActions = require('./controller/adminController')

const users_cruds = adminActions('users', process.env.DB_URL, User.schema)

const students_cruds = adminActions(
	'students',
	process.env.DB_URL,
	Student.schema
)
const uni_years_cruds = adminActions(
	'uniyears',
	process.env.DB_URL,
	Uni_year.schema
)

const studentActions = require('./controller/studentController')
const teacherActions = require('./controller/teacherController')
const {protect, restrictTo} = require('./controller/authController')

app.use(
	express.urlencoded({
		extended: true,
	})
)
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Admin routes
app.use('/admin/students', protect, restrictTo('admin'), students_cruds)
app.use('/admin/uniyears', uni_years_cruds)
app.use('/admin/teachers', protect, restrictTo('admin'), users_cruds)
//Student routes
app.use('/students', protect, restrictTo('student'), studentActions)
//Teacher routes
app.use('/teachers', protect, restrictTo('teacher', 'admin'), teacherActions)
app.use('/login', login)
app.use('/changePassword/:id', protect, changePassword)

//Test routes
app.use('/test/admin/students', students_cruds)
app.use('/test/admin/uniyears', uni_years_cruds)
app.use('/test/admin/teachers', users_cruds)
app.use('/test/students', protect, studentActions)
app.use('/test/teachers', protect, teacherActions)
app.use('/test/login', login)

const port = process.env.PORT || 3000
app.listen(port)

module.exports = app
