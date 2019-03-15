const express = require('express')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')
const axios = require('axios')


const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

let arr = []
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  // socket.emit('count-client', arr);
  // socket.on('count-server', function (data) {
  //   arr.push(data)
  //   console.log(arr)
  //   socket.broadcast.emit('count-client', data);
  //   socket.emit('count-client', data);
  // });
  socket.on('online', (name) => {
    if (!name) {
      return;
    }
    socket.broadcast.emit('online', name);
  });
  socket.on('sendGroupMsg', data => {
    socket.broadcast.emit('receiveGroupMsg', data);
  });
});
// server.listen(80);


// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

app.use(cookieParser('lwj')) // 相当于 app.use('/', cookieParser('lwj')) 

app.get('/setCookie', (req, res) => {
  res.cookie('a', 1)
  res.cookie('b', 2, {maxAge: 60*1000})
  res.cookie('c', 3, {signed: true})
  res.cookie('d', 4)
  res.send('设置cookie成功')
})
app.get('/getCookie', (req, res) => {
  res.json({
    unsigned: req.cookies,
    signed: req.signedCookies 
  })
})
app.get('/deleCookie', (req, res) => {
  res.clearCookie('d')
  res.send('删除cookie  d成功')
})


//设置跨域访问
app.all('*', function(req, res, next) {
  // console.log(req.headers.origin)
  if (req.headers.origin && req.headers.origin.indexOf('localhost') > -1 || req.headers.origin && req.headers.origin.indexOf('github') > -1) { // !只允许localhost的进行跨域访问
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

const sign = 'bb9afbba667fd0deb80ea7faea3f1c5f'

app.get('/getPosition', async (req, res) => {
  let { status, data: { province, city } } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
  console.log(status)
  if (status === 200) {
    res.json({
      province,
      city
    })
  } else {
    res.json({
      province: '',
      city: ''
    })
  }
})

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  res.send('获取文件失败')
})

server.listen(3334, () => {
  console.log('服务已启动')
})