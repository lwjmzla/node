// !微信验证本人服务器有效性    的 中间件
const sha1 = require('sha1')
const config = require('../config/index.js')
const { getUserDataAsync, parseXML, formatMessage } = require('../utils/tool.js')
// !为什么不直接 module.exports = (req, res, next) => {}  因为这样就不方便在外面传参数 近函数里面
module.exports = () => {
  return async (req, res, next) => {
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
    //console.log(sha1Str)
    
    if (req.method === 'GET') {
      if (sha1Str === signature) { // !说明信息来自微信服务器 验证服务器用的
        res.send(echostr)
      } else {
        res.end('error')
      }
    } else if (req.method === 'POST') {
      // !微信服务器将用户发送的数据以POST的形式转发到开发者服务器
      if (sha1Str === signature) { // !说明信息来自微信服务器
        //console.log(req.query)
        // { signature: 'c72fb233dc8a863d0d9845ced59c23e952f217a5',
        // timestamp: '1557923254',
        // nonce: '525511214',
        // openid: 'oRkqr1eOXrPJdi7oR8nOBeAqpr7c' } // 用户的微信ID
        const xmlData = await getUserDataAsync(req)
        /*
          <xml>
          <ToUserName><![CDATA[gh_593dd36817aa]]></ToUserName>   // 开发者id
          <FromUserName><![CDATA[oRkqr1eOXrPJdi7oR8nOBeAqpr7c]]></FromUserName>  用户的微信IDopenid
          <CreateTime>1557925316</CreateTime> // 发送的时间戳
          <MsgType><![CDATA[text]]></MsgType> // 消息类型
          <Content><![CDATA[11]]></Content> // 发送内容
          <MsgId>22304129983007128</MsgId> // 消息id 微信服务器会默认保存3天用户发送的数据，通过此id三天内就能找到消息数据
          </xml>
        */
        let jsData = parseXML(xmlData)
        /*
          { xml:
            { ToUserName: [ 'gh_593dd36817aa' ],
              FromUserName: [ 'oRkqr1eOXrPJdi7oR8nOBeAqpr7c' ],
              CreateTime: [ '1557926942' ],
              MsgType: [ 'text' ],
              Content: [ '123' ],
              MsgId: [ '22304147609816463' ] 
            } 
          }
        */
        let message = formatMessage(jsData)
        console.log(message)
        /*
          !一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
          1、开发者在5秒内未回复任何内容 
          2、开发者回复了异常数据，比如JSON数据、字符串、xml数据有多余空格！！！等
        */
        let content = '您在说什么，我没听懂'
        if (message.MsgType ==='text') {
          if (message.Content === '1') {
            content = '123'
          } else if (message.Content === '2') {
            content = '234'
          } else if (message.Content.includes('爱')) {
            content = '我爱你'
          }
        }
        let replyMessage = `
          <xml>
            <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            <CreateTime>${new Date().getTime()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${content}]]></Content>
          </xml>
        `
        res.send(replyMessage)
        // res.end('') // !如果开发者服务器没有返回响应 给微信服务器  微信 会请求三次
      } else {
        res.end('error')
      }
    } else {
      res.end('error')
    }
    
    next();
  }
}