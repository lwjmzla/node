const Router = require('koa-router');
const router = new Router();

router.prefix('/demo1')

// router.get('/', async (ctx,next) => { // 只匹配 路由'/'
//   console.log(1)
//   ctx.body = 'hello'
// });

router.get('/api', async (ctx) => {
  const params = ctx.request.query
  console.log(params)
  ctx.body = params
});

router.post('/post', async (ctx) => { // router.prefix('/demo1')   http://localhost:3000/demo1/post
  const {body} = ctx.request
  console.log(body)
  ctx.body = {
    ...body
  }
});

module.exports = router