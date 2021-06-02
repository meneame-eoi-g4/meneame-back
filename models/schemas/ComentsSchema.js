const { Schema } = require("mongoose")

const ComentSchema = new Schema({
  author: {
    name: {type: String, required: true, minlength: 3, maxlength: 200},
    img: { type: String, required: true }
  },
  order: {type: Number},
  content: { type: String, required: true, minlength: 3 },
  published_at: {type: Date, default: Date.now},
  votes: {type: Number, default: 0},
})

module.exports = ComentSchema