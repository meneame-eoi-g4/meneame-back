const { Schema } = require("mongoose")

let messageSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 250 },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = messageSchema
