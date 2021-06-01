
const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const articleModel = require('../models/ArticleModel')
const authMiddleware = require('../modules/authenticator')
const publicAccess = authMiddleware(false, ['user', 'admin'])
const onlyAdminAccess = authMiddleware(true, ['admin'])

router.route('/articles')
  .get(publicAccess, async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const filterParams = {}

      if (!req.tokenData || req.tokenData.profile === 'user') {
        filterParams.enabled = true
      }

      const articleList = await articleModel.find(filterParams).sort({ published_at: 'DESC', title: 'ASC' }).limit(limit).exec()

      res.json(articleList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post(onlyAdminAccess, async (req, res) => {
    try {
      let newArticle = req.body

      if (!newArticle.hasOwnProperty("slug") ||
        (newArticle.hasOwnProperty("slug") && newArticle.slug === '')) {
        //generamos el slug
        newArticle.slug = newArticle.title
      }

      newArticle.slug = slugify(newArticle.slug, { lower: true, strict: true })

      newArticle = await new articleModel(newArticle).save()

      res.status(201).json(newArticle)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/articles/:articleSlug')
  .get(publicAccess, async (req, res) => {
    try {
      const articleSlug = req.params.articleSlug

      const filterParams = {slug: articleSlug}

      if (!req.tokenData || req.tokenData.profile === 'user') {
        filterParams.enabled = true
      }

      const foundArticle = await articleModel.findOne(filterParams).exec()

      //early return
      if (!foundArticle) {
        res.status(404).json({ message: `Artículo con ruta ${articleSlug} no encontrado.` })
        return
      }

      res.json(foundArticle)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/articles/:articleId')
  .put(onlyAdminAccess, async (req, res) => {
    try {
      const articleId = req.params.articleId
      const articleData = req.body

      if (!articleData.hasOwnProperty("slug") ||
        (articleData.hasOwnProperty("slug") && articleData.slug === '')) {
        //generamos el slug
        articleData.slug = articleData.title
      }

      articleData.slug = slugify(articleData.slug, { lower: true, strict: true })

      let updatedItem = await articleModel.findOneAndUpdate({ _id: articleId }, articleData, { new: true }).exec()

      if (!updatedItem) {
        res.status(404).json({ message: `Artículo con identificador ${articleId} no encontrado.` })
        return
      }

      res.json(updatedItem)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .delete(onlyAdminAccess, async (req, res) => {
    try {
      const articleId = req.params.articleId

      const result = await articleModel.findOneAndDelete({ _id: articleId }).exec()

      if (!result) {
        res.status(404).json({ message: `Artículo con identificador ${articleId} no encontrado.` })
        return
      }

      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
