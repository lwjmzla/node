const express = require('express')
// const sha1 = require('sha1')
//const axios = require('axios')
//const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')
const auth = require('./wechat/auth.js')

const router = require('./routes/index.js')

const app = express()

// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

app.use(cookieParser('lwj')) // 相当于 app.use('/', cookieParser('lwj')) 

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

const config = {
  token: 'tokenabc123',
  appID: 'wxe395b6751afb0527',
  appsecret: '05dc1e5e0cd3017b8706242eff8a826d'
}
// !微信验证本人服务器有效性  
app.use(auth())



app.use(router) // !app.use('/',router) 这种就是相当于自动加前缀

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  res.send('获取文件失败')
})

app.listen(3335, () => {
  console.log('3335服务已启动')
})