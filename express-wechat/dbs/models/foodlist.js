
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const foodlistSchema = new Schema({
  cate_id: { // !菜系ID 相同菜系的一样
    type: String,
    require: true
  },
  catename: { // !菜系名称
    type: String,
    // unique: true,
    require: true
  },
  img_url: {
    type: String,
    require: true
  },
  price: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('FoodList', foodlistSchema)
