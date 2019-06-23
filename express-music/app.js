const express = require('express')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const postBody = require('body-parser')
const dayjs = require('dayjs')
const cookieParser = require('cookie-parser')
const axios = require('axios')


const app = express()


// 配置body-parser
app.use(postBody.urlencoded({extended:false})) // 解析文本格式数据(application/x-www-form-urlencoded)
app.use(postBody.json()) // 解析json格式数据(application/json)

app.use(cookieParser('lwj')) // 相当于 app.use('/', cookieParser('lwj')) 




//设置跨域访问
// app.all('*', function(req, res, next) {
//   console.log(req.headers.origin)
//   //if ((req.headers.origin && req.headers.origin.indexOf('localhost') > -1) || (req.headers.origin && req.headers.origin.indexOf('github') > -1))) { // !只允许localhost的进行跨域访问
//     res.header("Access-Control-Allow-Origin", "*");
//     // res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     if (req.method == 'OPTIONS') {
//       res.send(200); //让options请求快速返回/
//     }
//     else {
//       next();
//     }
//   //}
//   //next();
// })
app.all('*',function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

	if (req.method == 'OPTIONS') { // !标明跨域支持option请求方法
		res.send(200); /让options请求快速返回/
	}
	else {
		next();
	}
});

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
// -----------------------------音乐接口开始
let prefix = 'http://ustbhuangyi.com'
app.get('/getDiscList', async (req, res) => {
	const url = prefix+ `/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.7673530246632889`
	let {data} = await axios.get(url)
	res.send(data)
})
app.get('/getSongList', async (req, res) => {
	let disstid = req.query.disstid
	const url = prefix + `/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${disstid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`
	const {data} = await axios.get(url)
	res.send(data)
})
//! post请求时，好奇怪 后端好难接收，所以 前端要1.qs.stringify 2.'Content-Type': 'application/x-www-form-urlencoded' 这样后端能接收了，但是 formData格式看如何处理数据了
app.get('/getPurl', async (req, res) => {
	let obj = {
		comm: JSON.parse(req.query.comm),
		url_mid: JSON.parse(req.query.url_mid),
	}
	// !注意post请求的时候 数据格式 严格要求 是obj 就要obj  string就是string
	const {data} = await axios.post(prefix + '/music/api/getPurlUrl', obj)
	res.send(data)
})
app.get('/getLyric', async (req, res) => {
	let mid = req.query.mid
	const url = prefix + `/music/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${mid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1535080355295`
	const {data} = await axios.get(url)
	res.send(data)
})
app.get('/searchSongs', async (req, res) => {
	let query = req.query.query
	let page = req.query.page
	const url = prefix + `/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${query}&p=${page}&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`
	const {data} = await axios.get(url)
	res.send(data)
})

app.post('/postAjax', async (req, res) => {
	console.log(req.body)
	res.json({code: 0})
})
// -----------------------------音乐接口结束

app.use('/', (req, res, next) => { // !app.use 是非完全匹配  反正 当前情况都满足
	console.log('中间件1')
	next()
})
app.all('*', function(req, res, next) {
	console.log('中间件2')
	next();
})


// 404
app.use(function (req, res, next) { //!其实 就是省略 '/'
	res.render('404.html')
})
// !统一处理next(err)  放在404后面
app.use('/', function (err, req, res, next) {
	console.log(err)
	res.send('获取文件失败')
})

app.listen(3335, () => {
	console.log('服务已启动')
})
