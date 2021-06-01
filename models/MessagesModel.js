'use strict'

const mongoose = require('mongoose')

const MessageSchema = require('./schemas/MessageSchema')

const MessageModel = mongoose.model('messages', MessageSchema)

module.exports = MessageModel
