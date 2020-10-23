const express = require('express')
const postBody = require('body-parser')



const rootRouter = require('./routes/index.js')

const userRouter = require('./routes/user.js')

const app = express()

// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)


//设置跨域访问
app.all('*',function (req, res, next) {
  //if (req.headers.origin && req.headers.origin.indexOf('localhost') > -1) ) {} // !只允许localhost的进行跨域访问
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') { // !标明跨域支持option请求方法
    res.send(200); //让options请求快速返回/
  }
  else {
    next();
  }
});


// !多个路由文件的方式。
app.use(rootRouter) // !app.use('/',router) 这种就是相当于自动加前缀
app.use('/user',userRouter)  // !集体加前缀/user

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  //res.send('获取文件失败') // !比如访问/test123出现了错误Error: Can't set headers after they are sent
  res.end('获取文件失败') // !上面错误的解决方式1.把send改为end   2.在类似的res.send()等函数也要加return  例如在 auth.js 改成return res.end('error') 全部
})

app.listen(3336, () => {
  console.log('3336服务已启动')
})