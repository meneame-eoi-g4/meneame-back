const { Schema } = require("mongoose")

let userSchema = new Schema({
  firstname: { type: String, required: true, minlength: 3, maxlength: 100 },
  lastname: { type: String, required: true, minlength: 3, maxlength: 100 },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, maxlength: 200 },
  profile: { type: String, required: false, default: 'user' },
  enabled: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = userSchema