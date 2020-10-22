const dayjs = require('dayjs')
const User = require('../dbs/models/users')
const express = require('express')
const router = express.Router()
const md5 = require('md5')
const session = require('express-session')
const cookieParser = require('cookie-parser')

router.use(cookieParser('lwj'))

// router.use(session({
//   secret: 'lwj', // 加密存储
//   resave: false, // 客户端并行请求是否覆盖: true 是 false 否
//   saveUninitialized: true // 初始化session存储
// }))

// 拦截
router.use('/',async function(req, res, next) {
  // 拦截未登录的首页
  if (req.url === '/') {
    if (req.cookies.isLogin === 'true') { //cookies 的值是字符串
      next()
    } else { // 1.已登出。2.时间过期
      res.redirect('/login') // !匹配这个等于 匹配了  /  和  /login    end send render redirect 后面都不需要跟next()
    }
  } else {
    next()
  }
})

router.get('/', async (req, res) => {
  //console.log(req.session.userInfo)
  const arrDataDb = await User.find()
  res.render('index.html', {
    stus: arrDataDb,
    //userInfo: req.session.userInfo
    userInfo: req.cookies.userInfo
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
      pwd: md5(pwd),
      age,
      sex,
      create_at
    })
    // console.log(user)  返回这条信息的对象
    if (user) {
      res.redirect('/')
    } else {
      res.write('addItem失败')
    }
  }
})

router.get('/login', async (req, res) => {
  res.render('login.html')
})
router.post('/login', async (req, res) => {
  const {name, pwd} = req.body
  const result = await User.find({name}) // 数组 只有一条数据
  const isExist = result.length
  if (isExist) {
    if (md5(pwd) === result[0].pwd) {
      // !理论上，注册的时候pwd经过加密存到数据库，数据库的pwd即result[0].pwd 是已经MD5加密的
      // !所以 在比较的时候  应该用 md5(pwd) === result[0].pwd 来判断     其实md5觉得没啥卵用
      // req.session.isLogin = true
      // req.session.userInfo = result[0]
      res.cookie('isLogin', true, {maxAge: 60*1000})
      res.cookie('userInfo', result[0], {maxAge: 60*1000})
      res.json({
        status: 0,
        msg: '登录成功'
      })
    } else {
      res.json({
        status: 1,
        msg: '密码有误'
      })
    }
  } else {
    res.json({
      status: 1,
      msg: '用户名不存在，请注册'
    })
  }
})
router.post('/logout', async (req, res) => {
  // req.session.isLogin = false
  res.cookie('isLogin', false)
  res.json({
    status: 0,
    msg: '登出成功'
  })
})

router.get('/register', async (req, res) => {
  res.render('register.html')
})
router.post('/register', async (req, res) => {
  const {name, pwd} = req.body
  const result = await User.find({name}) // 数组 只有一条数据
  const isExist = result.length
  if (isExist) {
    res.json({
      status: 1,
      msg: '用户名已存在'
    })
  } else {
    console.log(1)
    const arrDataDb = await User.find()
    let id = arrDataDb.length ? arrDataDb.length + 1 : 1
    console.log(2)
    const create_at = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.log(3)
    const user = await User.create({
      id,
      name,
      pwd: md5(pwd),
      age: '18',
      sex: '男',
      create_at
    })
    console.log(4)
    res.json({
      status: 0,
      msg: '注册成功'
    })
  }
})
module.exports = router
