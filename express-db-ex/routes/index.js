const dayjs = require('dayjs')
const User = require('../dbs/models/users')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const arrDataDb = await User.find()
  res.render('index.html', {
    stus: arrDataDb
  })
})

router.get('/add', async (req, res) => { // !如果设置/stu/add   路径有问题的话  要在html改路径   /static
  res.render('post.html')
})

router.post('/add', async (req, res) => {
  // console.log(req.body)  // { name: 'lwj', pwd: '1231', age: '18', sex: '男' }
  const arrDataDb = await User.find()
  let id = arrDataDb.length ? arrDataDb.length + 1 : 1
  const create_at = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const {name, pwd, age, sex} = req.body
  // !排除已存在的数据
  const result = await User.find({name})
  const isExist = result.length
  if (isExist) {
    res.json({
      msg: '数据已存在'
    })
  } else {
    const user = await User.create({
      id,
      name,
      pwd,
      age,
      sex,
      create_at
    })
    if (user) {
      res.redirect('/')
    } else {
      res.write('addItem失败')
    }
  }
})

module.exports = router
