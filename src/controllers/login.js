// check the username and password in database
// if exist create JWT
//send back to frontend
const { BadRequest } = require('../error')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequest('username or password must be provided')
  }
  console.log(process.env.JWT_SECRET)
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
  res.status(200).json({ msg: 'user created', token })
}

const dashboard = async (req, res) => {
  console.log(req.user)
  res.json({ msg: 'login success' })
}

module.exports = { login, dashboard }
