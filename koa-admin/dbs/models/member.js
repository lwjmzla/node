
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const memberSchema = new Schema({
  memberCode: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    unique: true,
    require: true
  },
  age: {
    type: String
  },
  sex: {
    type: String
  },
  amount: {
    type: Number,
  },
  createTime: {
    type: String,
    require: true
  },
  updateTime: {
    type: String
  },
})

module.exports = mongoose.model('Member', memberSchema)
