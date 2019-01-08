
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  id: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    unique: true,
    require: true
  },
  pwd: {
    type: String,
    require: true
  },
  age: {
    type: String,
    require: true
  },
  sex: {
    type: String,
    require: true
  },
  create_at: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('User', userSchema)
