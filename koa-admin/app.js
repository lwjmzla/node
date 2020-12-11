const Koa = require('koa')
const path = require('path')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const json = require('koa-json')
const helmet = require('koa-helmet')
const statics = require('koa-static')
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const jst = require('./utils/token')

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})
var db = mongoose.connection;

db.on('error', function(error){
  console.log(error);
});

db.on('open',function(error){
  if(error){
    console.log(error);
  } else {
    console.log('dbs connect success.');
  }
});

const app = new Koa()
const router = require('./routes/index.js'); // !混合了多个功能的路由了

app.use(statics(path.join(__dirname, './public')))  // http://localhost:3000/license.jpg
app.use(helmet()) // ! 增加头部安全信息 
app.use(koaBody())
app.use(cors())
app.use(json({pretty:false, param: 'pretty'})) // !我觉得没什么卵用，默认不 pretty,可以添加参数来pretty  http://localhost:3000/api/api?name=123&age=18&pretty

let whiteList = ['/getCaptcha', '/register', '/login', '/modifyPwd']
app.use(async (ctx,next) => { // !登录状态拦截
  let url = ctx.url || ''
  let header = ctx.request.header;
  let token = header['x-authorization']
  let loginAccount = jst.verifyToken(token)
  console.log(loginAccount, 'loginAccount')
  if (whiteList.includes(url) || loginAccount) {
    await next()
  } else {
    ctx.body = {
      code: 401,
      content: null,
      message: '登录已过期，请重新登录',
      success: false
    }
  }
	// await next() // !插件的都是 async 和 await next()
})

app.use(router()); // ! 用了require('koa-combine-routers') 里面做了处理，不需要  app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
	console.log('端口3000服务已启动')
})