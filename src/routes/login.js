const express = require('express')
const router = express.Router()
const { login, dashboard } = require('../controllers/login')
const authMiddleware = require('../middlewares/auth')
router.route('/dashboard').get(authMiddleware,dashboard)
router.route('/login').post(login)

module.exports = router
