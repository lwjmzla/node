// !微信验证本人服务器有效性    的 中间件
const sha1 = require('sha1')
const config = require('../config/index.js')
// !为什么不直接 module.exports = (req, res, next) => {}  因为这样就不方便在外面传参数 近函数里面
module.exports = () => {
  return (req, res, next) => {
    console.log(req.query)
    // { signature: 'afb9b98e74e2eb1e02d0e7794a4f0d555306905f', //微信的加密签名
    // echostr: '2674559523603047929',  // 微信的随机字符串
    // timestamp: '1557415288', //
    // nonce: '205886582' }   //  随机数字
    const {token} = config
    const {signature, echostr, timestamp, nonce} = req.query
    let arr = [timestamp,nonce,token]
    arr.sort()
    const sha1Str = sha1(arr.join(''))
    console.log(sha1Str)
    if (sha1Str === signature) { // !说明信息来自微信服务器
      res.send(echostr)
    } else {
      res.end('error')
    }
    
    next();
  }
}