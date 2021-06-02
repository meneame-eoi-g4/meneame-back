
const mongoose = require('mongoose')

const ComentsSchema = require('./schemas/ComentsSchema')

const ComentsModel = mongoose.model('coments', ComentsSchema)

module.exports = ComentsModel
