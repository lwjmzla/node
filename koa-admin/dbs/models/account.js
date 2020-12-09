
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const memberAccount = new Schema({
  account: {
    type: String,
    require: true
  },
  pwd: {
    type: String,
    require: true
  },
  createTime: {
    type: String,
    require: true
  },
})

module.exports = mongoose.model('Account', memberAccount)
