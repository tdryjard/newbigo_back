const express = require('express')
const Command = require('../../controllers/command/command.controller')

const router = express.Router()

router.post('/create', Command.create)

module.exports = router