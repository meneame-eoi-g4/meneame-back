'use strict'

const mongoose = require('mongoose')

const ArticleSchema = require('./schemas/ArticleSchema')

const ArticleModel = mongoose.model('articles', ArticleSchema)

module.exports = ArticleModel
