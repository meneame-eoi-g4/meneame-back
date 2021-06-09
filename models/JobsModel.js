
const mongoose = require('mongoose')

const JobSchema = require('./schemas/JobSchema')

const JobsModel = mongoose.model('articles', JobSchema)

module.exports = JobsModel
