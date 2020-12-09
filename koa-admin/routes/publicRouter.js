const Router = require('koa-router');
const router = new Router();
const svgCaptcha = require('svg-captcha')
const dayjs = require('dayjs')
const Account = require('../dbs/models/account')


router.get('/getCaptcha', async (ctx) => {
  const params = ctx.request.query
  console.log(params)
  const newCaptcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1il', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true
    //background: '#cc9966' // 验证码图片背景颜色
  })
  ctx.body = {
    code: 200,
    data: newCaptcha.data
  }
});

let secretAuthCode = 'lwj'
router.post('/register', async (ctx) => { // router.prefix('/demo1')   http://localhost:3000/demo1/post
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
module.exports = router