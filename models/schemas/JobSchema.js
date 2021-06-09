const { Schema } = require("mongoose")
//const slugify = require('slugify')

const JobSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
 
  
  author: {
    name: {type: String, required: true, minlength: 3, maxlength: 200},
    img: { type: String, required: true }
  },
  content: { type: String, required: true, minlength: 3 },
  published_at: {type: Date, default: Date.now},
  categories: { type: String, required: true, enum: ["niños","mayores"] },
  citie:{ type: String, required: true, minlength: 3 },
  age: { type: Number, required: true },
  disability: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  
  
})

module.exports = JobSchema
