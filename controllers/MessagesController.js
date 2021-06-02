
const express = require('express')
const router = express.Router()
const authMiddleware = require('../modules/authenticator')
const onlyAdminAccess = authMiddleware(true, ['admin'])
const onlyUser = authMiddleware(true, ['User'])

const ComentsModel = require('../models/ComentsModel')

router.route('/articles/:articleId')
  .get(onlyAdminAccess, async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const messageList = await ComentsModel.find().sort({ created_at: 'DESC' }).limit(limit).exec()

      res.json(messageList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post(onlyUser, async (req, res) => {
    let messageData = req.body
    try {

      messageData = await new ComentsModel(messageData).save()

      res.status(201).json(messageData)
    } catch (error) {
      res.status(500).json({ message: error.message })
      return
    }
  })

module.exports = router
