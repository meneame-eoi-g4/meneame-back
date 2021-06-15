const { Schema } = require("mongoose")

const ComentSchema = new Schema({
  author: {
    name: {type: String, required: true, minlength: 3, maxlength: 200},
    _id:{type: String, required: true, minlength: 3, maxlength: 200}
  
   
  },
  from:{
    _id:{type: String, required: true, minlength: 3, maxlength: 200}
  },
  order: {type: Number},
  content: { type: String, required: true, minlength: 3 },
  published_at: {type: Date, default: Date.now},
 valoration: {type: Number,required: true},
})

module.exports = ComentSchema