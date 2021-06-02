const { Schema } = require("mongoose")
//const slugify = require('slugify')

const ArticleSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  slug: { type: String, required: true, minlength: 3, maxlength: 255, unique: true },
  image: { type: String, required: true },
  author: {
    name: {type: String, required: true, minlength: 3, maxlength: 200},
    image: { type: String, required: true }
  },
  content: { type: String, required: true, minlength: 3 },
  published_at: {type: Date, default: Date.now},
  category: { type: String, required: true, enum: ["Cosas"] },
  enabled: { type: Boolean, default: true },
  positive: {type: Number, default: 0},
  negative: {type: Number, default: 0},
  coments: {type: Array, default: []}
})

module.exports = ArticleSchema
