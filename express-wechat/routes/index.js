const dayjs = require('dayjs')
const FoodList = require('../dbs/models/foodlist')
const express = require('express')
const router = express.Router()
const md5 = require('md5')
const session = require('express-session')
const cookieParser = require('cookie-parser')

router.use(cookieParser('lwj'))

var obj = {
  "cate_id": "5ac0896ca880f20358495508",
  "catename": "精选热菜",
  "title": "娃娃菜炖豆腐",
  "price": "2",
  "img_url": "upload\\20180417\\1523969206225.jpg"
}
router.get('/addFoodList', async (req, res) => {
  const result = await FoodList.find({"title": new RegExp('娃娃菜')})
  console.log(result)
  const isExist = result.length
  if (isExist) {
    res.json({
      msg: '数据已存在'
    })
  } else {
    const foodItem = await FoodList.create(obj)
    if (foodItem) {
      res.json({
        msg: '添加成功'
      })
    } else {
      res.write('addFoodList失败')
    }
  }
})

router.get('/api/productlist', async (req, res) => {
  const result = await FoodList.find()
  // TODO研究怎么形成 需要的数据格式
  // let arr = []
  // result.forEach((item) => {
  //   arr.push({
  //     title: item.catename
  //   })
  // })
  // arr = [...new Set(arr)]
  // console.log(arr)
  res.json({
    result
  })
})

router.get('/test', async (req, res) => {
  res.json({
    test: 123
  })
})

module.exports = router