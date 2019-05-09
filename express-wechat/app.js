const express = require('express')
const sha1 = require('sha1')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')

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

app.use(function(req, res, next) {
  console.log(req.query)
  // { signature: 'afb9b98e74e2eb1e02d0e7794a4f0d555306905f', //微信的加密签名
  // echostr: '2674559523603047929',  // 微信的随机字符串
  // timestamp: '1557415288', //
  // nonce: '205886582' }   //  随机数字
  const {token} = config
  const {signature, echostr, timestamp, nonce} = req.query
  let arr = [timestamp,nonce,token]
  arr.sort()
  const sha1Str = sha1(arr.join(''))
  console.log(sha1Str)
  if (sha1Str === signature) { // !说明信息来自微信服务器
    res.send(echostr)
  } else {
    res.end('error')
  }
  
  // next();
})

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