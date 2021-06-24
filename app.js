/** @format */

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*') // Update to match the domain you will make the request from
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()
	console.log(req.requestTime)
	next()
})

module.exports = app

//Hello skander
