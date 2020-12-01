
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const consumeRecordSchema = new Schema({
  memberCode: {
    type: String,
    require: true
  },
  operateType: { // plus minus
    type: String,
    require: true
  },
  remark: {
    type: String
  },
  createTime: {
    type: String,
    require: true
  },
  operateAmount: {
    type: Number,
  },
  amountAfterOperate: {
    type: Number,
  }
})

module.exports = mongoose.model('consumeRecord', consumeRecordSchema)
