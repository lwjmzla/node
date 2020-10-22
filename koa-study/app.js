const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const json = require('koa-json')

const app = new Koa()
const router = require('./routes/index.js');

app.use(async (ctx,next) => { // !全部匹配
	await next() // !插件的都是 async 和 await next()
})

app.use(koaBody())
app.use(cors())
app.use(json({pretty:false, param: 'pretty'})) // !我觉得没什么卵用，默认不 pretty,可以添加参数来pretty  http://localhost:3000/api/api?name=123&age=18&pretty

app.use(router()); // ! 用了require('koa-combine-routers') 里面做了处理，不需要  app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
	console.log('端口3000服务已启动')
})