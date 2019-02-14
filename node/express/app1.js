const express = require('express')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
const app = express()

app.get('/', async (req, res) => {
  var html = `
    <form action="/test/10" method="get">
      <input type="text" name="name" placeholder="名字" />
      <input type="text" name="age" placeholder="年龄" />
      <input type="submit" />
    </form>
  `
  res.send(html)
})

// app.get('/test', async (req, res) => {
//   console.log(req.url) //! /test?name=ret&age=ert
//   res.send('get')
// })

// app.post('/test', async (req, res) => {
//   let postData = ''
//   let paramObj = {}
//   req.on('data', (chunk) => {
//     //console.log(chunk.toString()) // !name=45654&age=18  只是 有可能数据大，才分片上传。
//     postData += chunk
//   })
//   req.on('end', async () => {
//     paramObj = querystring.parse(postData)
//     console.log(paramObj)
//     res.send('post')
//   })
// })

// ! 看看all 怎么获取 可能要判断  req.method
// app.all('/test', async (req, res) => {
//   res.send('all')
// })

// app.use('/test', async (req, res) => {
//   res.send('/test/xxxx')
// })

app.get('/test/:id', async (req, res) => {
  console.log(req.url) //! /test/10?name=ret&age=ert
  console.log(req.params)
  res.send('get')
})

// app.use('/public', async (req, res) => {
//   // console.log(req.url) // ! /css/a.css
//   fs.readFile('./public' + req.url, 'utf8' , (err, data) => {
//     if (err) { res.end('no file') }
//     res.end(data)
//   })
// })

app.use('/public', express.static('public'))

app.listen(8888, () => {
  console.log('服务已启动')
})