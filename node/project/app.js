const http = require('http')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')

var app = http.createServer()

let dataArr = [{name: 'lwj'}, {name: 'jack'}, {name: 'boss'}]

app.on('request', (req, res) => {
  if (req.url.indexOf('/public') !== 0) { // !不是静态资源才加这个，静态资源加了 会让静态资源失效
    res.setHeader("Content-Type", "text/html;charset=utf-8");
  }
  if (req.url === '/') {
    let extraHtml = ''
    dataArr.forEach((item) => {
      extraHtml = extraHtml.concat(`<li>${item.name}</li>`)
    })
    let data = fs.readFileSync('./views/index.html').toString() // !把buffer对象转换,都加toString比较靠谱
    data = data.replace('__INJECT__', extraHtml) // !这个相当于在html里挖了个插槽，然后填进去
    res.write(data)
  } else if (req.url === '/login') {
    const data = fs.readFileSync('./views/login.html').toString()
    res.write(data)
  } else if (req.url === '/404') {
    const data = fs.readFileSync('./views/404.html').toString()
    res.write(data)
  } else if (req.url.indexOf('/public') === 0) { // !加载静态资源
    // console.log(req.url)
    const data = fs.readFileSync('.' + req.url).toString() // !相对路径方式读取文件
    res.write(data)
  } else if (req.url.startsWith('/addItem')){ // ! 添加数据接口
    if (req.method === 'GET') {
      //console.log(querystring.parse(url.parse(req.url).query))
      const name = url.parse(req.url, true).query.name
      dataArr.push({name})
      res.statusCode = 302  // !这2个要一起用
      res.setHeader('Location', '/')  // !这2个要一起用
    } else if (req.method === 'POST') {
      let postData = ''
      let paramObj = {}
      req.on('data', (chunk) => {
        //console.log(chunk.toString()) // !name=45654&age=18  只是 有可能数据大，才分片上传。
        postData += chunk
      })
      req.on('end', () => {
        paramObj = querystring.parse(postData)
        console.log(paramObj)
        const name = paramObj.name
        dataArr.push({name})
        // ! 注意这个 end方法里  是异步的了，外面的  res.end() 执行得比较早，所以放到这里面才不报错
        res.statusCode = 302  // !这2个要一起用
        res.setHeader('Location', '/')  // !这2个要一起用
        res.end()
      })
    } else { console.log('other method') }
  } else {
    res.statusCode = 302  // !这2个要一起用
    res.setHeader('Location', '/404')  // !这2个要一起用
  }
  if (req.method !== 'POST') {
    res.end()
  }
})

app.listen(8888, () => {
  console.log('服务已启动')
})