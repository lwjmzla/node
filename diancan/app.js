const express = require('express')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const router = require('./routes/index.js')

const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

let arr = []
io.on('connection', function (socket) {
});

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})

// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

// app.engine('html', require('express-art-template')) // 默认是 jade模板引擎
// app.use('/static', express.static('static')) // !当匹配到 /static  自动加载 static文件夹，所以html里的相对路径错，也没问题

app.use(cookieParser('lwj')) // 相当于 app.use('/', cookieParser('lwj')) 

// app.get('/setCookie', (req, res) => {
//   res.cookie('a', 1)
//   res.cookie('b', 2, {maxAge: 60*1000})
//   res.cookie('c', 3, {signed: true})
//   res.cookie('d', 4)
//   res.send('设置cookie成功')
// })
// app.get('/getCookie', (req, res) => {
//   res.json({
//     unsigned: req.cookies,
//     signed: req.signedCookies 
//   })
// })
// app.get('/deleCookie', (req, res) => {
//   res.clearCookie('d')
//   res.send('删除cookie  d成功')
// })



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



// routerFn(app) // !这种是原来 的app.get(...)  但这种要传参数，下面的不用   但这里也只需传app 其实没什么
app.use(router) // !app.use('/',router) 这种就是相当于自动加前缀

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  res.send('获取文件失败')
})

server.listen(3335, () => {
  console.log('服务已启动')
})