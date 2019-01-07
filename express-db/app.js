const express = require('express')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const User = require('./dbs/models/users')

const app = express()

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})

// 配置body-parser
app.use(postBody.urlencoded({extended:false}))
app.use(postBody.json())

app.engine('html', require('express-art-template')) // 默认是 jade模板引擎
app.use('/public', express.static('public'))

//设置跨域访问
app.all('*', function(req, res, next) {
  // console.log(req.headers.origin)
  if (req.headers.origin && req.headers.origin.indexOf('localhost') > -1) { // !只允许localhost的进行跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
  }
  next();
})

app.get('/', async (req, res) => {
  const userInfos = await User.find()
  // console.log(userInfos)
  res.render('index.html', {
    userInfos: userInfos
  })
})

app.get('/login', async (req, res) => {
  // const data = fs.readFileSync('./views/login.html')
  // res.end(data)
  res.render('login.html') // !为啥不要路径 ???  不要就不要了。。
})

app.get('/addItem', async (req, res) => {
  const {name, age} = url.parse(req.url, true).query
    const user = await User.create({
      name,
      age
    })
    if (user) {
      // res.statusCode = 302  //  
      // res.setHeader('Location', '/')  // !这玩意在express不凑效了。 看看原因。 ??? 原因不明
      res.redirect('/')
    } else {
      res.write('addItem失败')
    }
})

app.post('/addItem', async (req, res) => {
  // let postData = ''
  // let paramObj = {}
  // req.on('data', (chunk) => {
  //   //console.log(chunk.toString()) // !name=45654&age=18  只是 有可能数据大，才分片上传。
  //   postData += chunk
  // })
  // req.on('end', async () => {
  //   paramObj = querystring.parse(postData)
  //   console.log(paramObj)
  //   const {name, age} = paramObj

  //   const user = await User.create({
  //     name,
  //     age
  //   })
  //   if (user) {
  //     res.redirect('/')
  //   } else {
  //     res.write('addItem失败')
  //   }
  // })

  // console.log(req.body)
  const paramObj = req.body // ! 有body-parser 后简单了好多
  const {name, age} = paramObj
  const user = await User.create({
    name,
    age
  })
  if (user) {
    res.redirect('/')
  } else {
    res.write('addItem失败')
  }
})

app.get('/api', async (req, res) => {
  res.json({
    name: 'lwj'
  })
})

// 404
app.use(function (req, res, next) {
  res.render('404.html')
})

app.listen(8888, () => {
  console.log('服务已启动')
})