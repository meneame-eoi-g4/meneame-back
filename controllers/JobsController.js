
const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const jobsModel = require('../models/JobsModel')
const authMiddleware = require('../modules/authenticator')
const publicAccess = authMiddleware(false, ['user', 'admin'])
const onlyAdminAccess = authMiddleware(true, ['admin'])
const onlyUser = authMiddleware(true, ['user'])

router.route('/jobs')
  .get(publicAccess, async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const filterParams = {}

      if (!req.tokenData || req.tokenData.profile === 'user') {
        filterParams.enabled = true
      }

      const jobsList = await jobsModel.find(filterParams).sort({ published_at: 'DESC', title: 'ASC' }).limit(limit).exec()

      res.json(jobsList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post(onlyUser, async (req, res) => {
    try {
      let newArticle = req.body

      

      newArticle = await new jobsModel(newArticle).save()

      res.status(201).json(newArticle)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })



router.route('/jobs/:jobId')
  .put(onlyAdminAccess, async (req, res) => {
    try {
      const jobId = req.params.jobId
      const jobData = req.body

      if (!jobData.hasOwnProperty("slug") ||
        (jobData.hasOwnProperty("slug") && jobData.slug === '')) {
        //generamos el slug
        jobData.slug = jobData.title
      }

      jobData.slug = slugify(jobData.slug, { lower: true, strict: true })

      let updatedItem = await jobsModel.findOneAndUpdate({ _id: jobId }, jobData, { new: true }).exec()

      if (!updatedItem) {
        res.status(404).json({ message: `Artículo con identificador ${jobId} no encontrado.` })
        return
      }

      res.json(updatedItem)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .delete( async (req, res) => {
    try {
      const jobId = req.params.jobId

      const result = await jobsModel.findOneAndDelete({ _id: jobId }).exec()

      if (!result) {
        res.status(404).json({ message: `Artículo con identificador ${jobId} no encontrado.` })
        return
      }

      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
