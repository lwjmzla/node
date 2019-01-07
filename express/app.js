const express = require('express')
const url = require('url')
const app = express()
// const http = require('http')
// var app = http.createServer()
// app.on('request', (req, res) => {
//   res.setHeader("Content-Type", "text/html;charset=utf-8");
//   res.end('啊实打实<a href="/haha">哈哈</a>')
// })
app.engine('html', require('express-art-template')) // 默认是 jade模板引擎

app.get('/', async (req, res) => {
  //res.setHeader("Content-Type", "text/html;charset=utf-8"); //! 原生node js方式
  //res.end('啊实打实<a href="/haha">哈哈</a>')  //! 原生node js方式
  // res.send('啊实打实<a href="/haha">哈哈</a>')
  res.render('index.html', {
    username: 'lwj',
    age: 5,
    orders: [
      {id:1, title: '11111', price: 30},
      {id:2, title: '22222', price: 32},
    ]
  })
})

app.get('/api', async (req, res) => {
  res.json({
    name: 'lwj'
  })
})

app.listen(8888, () => {
  console.log('服务已启动')
})