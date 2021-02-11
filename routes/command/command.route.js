const express = require('express')
const Command = require('../../controllers/command/command.controller')

const router = express.Router()

router.post('/command', Command.create)

module.exports = router