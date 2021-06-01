const { Schema } = require("mongoose")
//const slugify = require('slugify')

const ArticleSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  slug: { type: String, required: true, minlength: 3, maxlength: 255, unique: true },
  image: { type: String, required: true },
  excerpt: {type: String, required: true, maxlength: 150},
  author: {
    name: {type: String, required: true, minlength: 3, maxlength: 200},
    bio: {type: String, required: true, minlength: 3, maxlength: 500},
    image: { type: String, required: true }
  },
  content: { type: String, required: true, minlength: 3 },
  published_at: {type: Date, default: Date.now},
  category: { type: String, required: true, enum: ['Restauración', 'General', 'Foodies', 'Promociones y descuentos'] },
  enabled: { type: Boolean, default: false }
})

module.exports = ArticleSchema
