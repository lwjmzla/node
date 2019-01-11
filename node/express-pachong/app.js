var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // !日志
const https = require('https')
const cheerio = require('cheerio')

https.get('https://www.ku6.com/index', (req, res) => {
  let html = ''
  req.on('data', (data) => {
    html += data
  })
  req.on('end', () => {
    //console.log(html)
    const $ = cheerio.load(html, {decodeEntities: false}) // !可以像JQ那样操作html里的元素
    const arrNavliEls = [].slice.call($('#video-container .video-image-warp'))
    let arrVideoPages = []
    arrNavliEls.forEach((item, index) => { // 注意item就是一个DOM而已  记得加上$
      //console.log($(item).attr('href'))
      const videoPage = 'https://www.ku6.com' + $(item).attr('href')
      arrVideoPages.push(videoPage)
      if (index === arrNavliEls.length - 1) {return} // 其实这里可以无视
      //console.log(videoPage)
      // if (index === 0) {
      //   getVideoUrl(videoPage)
      // }
      //setTimeout(() => {
        //console.log(index)
        getVideoUrl(videoPage)
      //}, index*20)
    })
    //console.log(arrVideoPages.length)
  })
})

function getVideoUrl (videoPage) {
  https.get(videoPage, (req, res) => {
    let htmlPage = ''
    req.on('data', (data) => {
      htmlPage += data
    })
    req.on('end', () => {
      //console.log(htmlPage)
      //const $ = cheerio.load(htmlPage, {decodeEntities: false})
      //console.log($('video').attr('src')) // !src 不是直接给上去的  用JS 给的。 id就可以获取，注意异步的也获取不了
      //const matchStr = 'flvURL: "'
      //const index = htmlPage.indexOf(matchStr) + matchStr.length
      //console.log(htmlPage.indexOf('flvURL: "')) // !这里是url的大概位置 url在script标签里。。。牛逼
      //console.log(htmlPage.substring(10231,10300))
      let str = htmlPage.substring(10231,10300)
      //console.log(str.lastIndexOf('"'))
      const videoUrl = str.substring(1,str.lastIndexOf('"'))
      console.log(videoUrl)
    })
  })
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use('/public', express.static('public'))
app.set('views', path.join(__dirname, 'views')); //  ! 未见过  这个就是设置路径罢了
app.engine('html', require('express-art-template'))
app.set('view engine', 'html'); //  ! 未见过  这里的作用相当于 在routes  res.render('index')  指的就是 index.html

app.use(logger('dev')); // !日志
app.use(express.json()); // !自带 body-parser？
app.use(express.urlencoded({ extended: false })); // !自带 body-parser？
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
