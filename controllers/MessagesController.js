'use strict'

const express = require('express')
const router = express.Router()
const config = require('../modules/config')
const authMiddleware = require('../modules/authenticator')
const onlyAdminAccess = authMiddleware(true, ['admin'])

const messageModel = require('../models/MessagesModel')

router.route('/messages')
  .get(onlyAdminAccess, async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const messageList = await messageModel.find().sort({ created_at: 'DESC' }).limit(limit).exec()

      res.json(messageList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post(async (req, res) => {
    let messageData = req.body
    try {

      messageData = await new messageModel(messageData).save()

      res.status(201).json(messageData)
    } catch (error) {
      res.status(500).json({ message: error.message })
      return
    }
  })

module.exports = router
