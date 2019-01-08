const express = require('express')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const User = require('./dbs/models/users')
// const routerFn = require('./routes/index-copy.js')
const router = require('./routes/index.js')

const app = express()

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})

// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

app.engine('html', require('express-art-template')) // 默认是 jade模板引擎
app.use('/static', express.static('static')) // !当匹配到 /static  自动加载 static文件夹，所以html里的相对路径错，也没问题

// let dataDb = {
//   stus: [
//     {id: 1, name: '11', pwd: '11', age: 11, sex: '男', create_at: '2017-08-06'},
//     {id: 2, name: '22', pwd: '22', age: 22, sex: '男', create_at: '2017-08-06'},
//     {id: 3, name: '33', pwd: '33', age: 33, sex: '男', create_at: '2017-08-06'},
//   ]
// }

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

app.use('/', (req, res, next) => { // !app.use 是非完全匹配  反正 当前情况都满足
  console.log('中间件1')
  next()
})
app.all('*', function(req, res, next) {
  console.log('中间件2')
  next();
})
// app.get('/', (req, res, next) => {
//   fs.readFile('xxxx', (err, data) => {
//     if (err) { 
//       next(err) // !注意  触发统一错误处理
//     } else {
//       res.send('ok')
//     }
//   })
// })

// routerFn(app) // !这种是原来 的app.get(...)  但这种要传参数，下面的不用   但这里也只需传app 其实没什么
app.use(router) // !app.use('/app',router) 这种就是相当于自动加前缀

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  res.send('获取文件失败')
})

app.listen(8888, () => {
  console.log('服务已启动')
})