const Router = require('koa-router');
const dayjs = require('dayjs')
const uuid = require('uuid');
const Member = require('../dbs/models/member')
const router = new Router();

router.prefix('/member')

// router.get('/api', async (ctx) => {
//   const params = ctx.request.query
//   console.log(params)
//   ctx.body = params
// });

router.post('/addOrUpdateMember', async (ctx) => { // router.prefix('/demo1')   http://localhost:3000/demo1/post
  const {body} = ctx.request
  console.log(body)
  let {name,phone,sex,amount,remark,memberCode} = body
  if (!memberCode) { // !新增
    // !判断手机号码是否存在
    const result = await Member.find({phone})
    const isExist = result.length
    if (isExist) {
      ctx.body = {
        code: 200,
        content: null,
        message: '手机号码已存在',
        success: false
      }
    } else {
      memberCode = 'UID' + uuid.v1().replace(/-/g,'') // !全局唯一的
      const createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      const member = await Member.create({
        memberCode,
        name,
        phone,
        sex,
        amount,
        createTime
      })

    }
  } else { // !修改资料

  }

  // const arrDataDb = await User.find()
  // let id = arrDataDb.length ? arrDataDb.length + 1 : 1
  // const create_at = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  // const {name, pwd, age, sex} = req.body
  // // !排除已存在的数据
  // const result = await User.find({name})
  // const isExist = result.length
  // if (isExist) {
  //   res.json({
  //     msg: '数据已存在'
  //   })
  // } else {
  //   const user = await User.create({
  //     id,
  //     name,
  //     pwd: md5(pwd),
  //     age,
  //     sex,
  //     create_at
  //   })
  //   // console.log(user)  返回这条信息的对象
  //   if (user) {
  //     res.redirect('/')
  //   } else {
  //     res.write('addItem失败')
  //   }
  // }

  ctx.body = {
    code: 200,
    content: [],
    message: '请求成功',
    success: true,
    memberCode
  }
});

module.exports = router