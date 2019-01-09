var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // !日志

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
