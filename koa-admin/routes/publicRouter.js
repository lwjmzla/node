const Router = require('koa-router');
const router = new Router();
const svgCaptcha = require('svg-captcha')

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

// router.post('/post', async (ctx) => { // router.prefix('/demo1')   http://localhost:3000/demo1/post
//   const {body} = ctx.request
//   console.log(body)
//   ctx.body = {
//     ...body
//   }
// });

module.exports = router