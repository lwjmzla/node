var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express1' }); // ! 这里不用设置 index.html
});

module.exports = router;
