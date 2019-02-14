
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  age: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('User', userSchema)
