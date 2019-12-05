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
const Wechat = require('./wechat/wechat.js')
const wechatApi = new Wechat()

const router = require('./routes/index.js')

const app = express()

// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

app.use(cookieParser('lwj')) // 相当于 app.use('/', cookieParser('lwj')) 

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
// 配置模板资源目录
app.set('views','./views')
// 配置模板引擎
app.set('view engine', 'ejs')

app.get('/search', (req,res) => {
  res.render('search')
})

app.get('/getSignature', async (req,res) => {
  console.log(1)
  console.log(req)
  const noncestr = Math.random().toString().split('.')[1];
  const timestamp = new Date().getTime();
  //const {ticket} = await wechatApi.fetchValidJsapiTicket();
  
  // 最后返回signature  timestamp  noncestr
  res.json({
    signature: 123
  })
})

// !微信验证本人服务器有效性  
app.use(auth()) // !加了这个后 './routes/index.js'的路由不生效了，都被拦截了。



app.use(router) // !app.use('/',router) 这种就是相当于自动加前缀

// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
  res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
  //res.send('获取文件失败') // !比如访问/test123出现了错误Error: Can't set headers after they are sent
  res.end('获取文件失败') // !上面错误的解决方式1.把send改为end   2.在类似的res.send()等函数也要加return  例如在 auth.js 改成return res.end('error') 全部
})

app.listen(3335, () => {
  console.log('3335服务已启动')
})