const http = require('http')

var app = http.createServer()

app.on('request', (req, res) => {
  // console.log(req.url)
  // console.log(req.headers)
  // console.log(req.rawHeaders) // 这个一般不用
  // console.log(req.httpVersion)
  // console.log(req.method)
  // res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.setHeader("Content-Type", "text/html;charset=utf-8");

  //res.statusCode = 404
  //res.statusMessage = 'Not Found' // 默认值

  if (req.url === '/') {
    res.write('首页<a href="/login">去登录页</a>')
  } else if (req.url === '/login') {
    res.write('登录页<a href="/">去首页</a>')
  } else {
    res.write('404') // 重定向怎么实现
  }
  res.end()
})

app.listen(8888, () => {
  console.log('服务已启动')
})