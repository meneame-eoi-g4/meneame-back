'use strict'

const express = require('express')
const router = express.Router()
const config = require('../modules/config')
const mailer = require('../modules/mailer')
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

    try {
      res.render(config.MESSAGES_EMAIL_TPL, messageData, async (err, emailBody) => {
        if (err) {
          //si se produce algún error de renderización del template se cancela el envío
          console.info("Se ha producido un error al renderizar la plantilla del email de contacto.")
          return
        }

        const from = { name: messageData.name, email: messageData.email }

        //envía correo electrónico
        await mailer.send(from, config.ADMIN_EMAIL, config.MESSAGES_SUBJECT, emailBody, true)
      })

    } catch (error) {
      console.info("Envío de correo electrónico al admin erróneo.")
      console.error(error)
    }

  })

module.exports = router
