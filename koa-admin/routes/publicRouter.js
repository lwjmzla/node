const Router = require('koa-router');
const router = new Router();
const svgCaptcha = require('svg-captcha')
const dayjs = require('dayjs')
const uuid = require('uuid');
const Account = require('../dbs/models/account')
const jst = require('../utils/token')

let captchaArr = []
let oneDay = 24 * 60 * 60 * 1000
setInterval(() => {
  captchaArr = []
}, oneDay)
router.get('/getCaptcha', async (ctx) => {
  // const params = ctx.request.query
  // console.log(params)
  const newCaptcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1il', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true
    //background: '#cc9966' // 验证码图片背景颜色
  })
  let text = newCaptcha.text
  text = text.toLowerCase()
  let identify = uuid.v1().replace(/-/g,'') // !全局唯一的
  captchaArr.push({ // !正常是用redis来缓存 验证码的数据
    text,
    identify
  })
  console.log(captchaArr)
  let obj = {
    svg: newCaptcha.data,
    identify
  }
  ctx.body = {
    code: 200,
    content: obj,
    message: '获取成功',
    success: true
  }
});

let secretAuthCode = 'lwj'
router.post('/register', async (ctx) => {
  const {body} = ctx.request
  console.log(body)
  let {account,pwd,authCode} = body
  if (authCode !== secretAuthCode) {
    ctx.body = {
      code: 200,
      content: null,
      message: '授权码错误',
      success: false
    }
    return
  }

  const result = await Account.find({account})
  const isExist = result.length
  if (isExist) { // !判断账号是否存在
    ctx.body = {
      code: 200,
      content: null,
      message: '账号已存在',
      success: false
    }
  } else {
    const createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // !await 看是否需要try catch
    await Account.create({
      account,
      pwd,
      createTime
    })
    ctx.body = {
      code: 200,
      content: null,
      message: '创建账号成功',
      success: true
    }
  }
});

// todo
router.post('/login', async (ctx) => {
  const {body} = ctx.request
  console.log(body)
  let {account,pwd,yzm,identify} = body
  let captchaCode
  try {
    captchaCode = captchaArr.find((item) => item.identify === identify)['text']
  } catch (err) {
    ctx.body = {
      code: 200,
      content: null,
      message: '验证码错误',
      success: false
    }
    return
  }
  if (yzm.toLowerCase() !== captchaCode) {
    ctx.body = {
      code: 200,
      content: null,
      message: '验证码错误',
      success: false
    }
    return
  }
  let result = await Account.findOne({account})
  result = result || {}
  const isExist = result.account
  if (isExist) { // !判断账号是否存在
    if (pwd !== result.pwd) {
      ctx.body = {
        code: 200,
        content: null,
        message: '密码错误',
        success: false
      }
      return
    } else { // !终于通过了
      let jwtToken = jst.generateToken(account)
      ctx.body = {
        code: 200,
        content: {jwtToken, account: {}},
        message: '登录成功',
        success: true
      }
      return
    }
  } else {
    ctx.body = {
      code: 200,
      content: null,
      message: '账号不存在',
      success: false
    }
    return
  }
});
module.exports = router