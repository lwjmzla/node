const Router = require('koa-router');
const dayjs = require('dayjs')
const uuid = require('uuid');
const Member = require('../dbs/models/member')
const ConsumeRecord = require('../dbs/models/consumeRecord')
const router = new Router();

router.prefix('/member')

// router.get('/api', async (ctx) => {
//   const params = ctx.request.query
//   console.log(params)
//   ctx.body = params
// });

router.post('/addMember', async (ctx) => { // router.prefix('/demo1')   http://localhost:3000/demo1/post
  const {body} = ctx.request
  console.log(body)
  let {name,phone,sex,amount,remark} = body

  const result = await Member.find({phone})
  const isExist = result.length
  if (isExist) { // !判断手机号码是否存在
    ctx.body = {
      code: 200,
      content: null,
      message: '手机号码已存在',
      success: false
    }
  } else {
    let memberCode = 'UID' + uuid.v1().replace(/-/g,'') // !全局唯一的
    const createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // !await 看是否需要try catch
    const member = await Member.create({
      memberCode,
      name,
      phone,
      sex,
      amount,
      createTime,
      updateTime: createTime
    })
    if (amount) {
      await ConsumeRecord.create({
        memberCode,
        operateType: 'plus',
        remark,
        createTime,
        operateAmount: Math.abs(amount),
        amountAfterOperate: Math.abs(amount)
      })
    }
    ctx.body = {
      code: 200,
      content: null,
      message: '创建会员成功',
      success: true
    }
  }
});

router.post('/updateMember', async (ctx) => {
  const {body} = ctx.request
  console.log(body)
  let {name,phone,sex,orginPhone,memberCode} = body
  const updateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  let params = {
    updateTime
  }
  if (phone ==orginPhone) { // !传入的phone和原来的phone是否一样
    params.name = name
    params.sex = sex
  } else {
    const result = await Member.find({phone})
    const isExist = result.length
    if (isExist) { // !判断手机号码是否存在
      ctx.body = {
        code: 200,
        content: null,
        message: '手机号码已存在',
        success: false
      }
      return
    } else {
      params.name = name
      params.sex = sex
      params.phone = phone
    }
  }
  await Member.where({memberCode}).update(params)
  ctx.body = {
    code: 200,
    content: null,
    message: '更新会员资料成功',
    success: true
  }
});

router.get('/getMemberList', async (ctx) => {
  const {query} = ctx.request
  let {name,phone,pageNo,pageSize} = query
  pageNo = parseInt(pageNo)
  pageSize = parseInt(pageSize)
  console.log(query)
  let searchParams = {}
  if (name) {
    searchParams.name = new RegExp(name) // !包含就查找
  }
  if (phone) {
    searchParams.phone = new RegExp(phone)
  }
  const allData = await Member.find(searchParams)
  // !skip 跳过多少条，    limit  限制多少条    .sort({'_id':-1}) 排序   .exec(cb);
  let result = await Member.find(searchParams).sort({'updateTime':-1}).skip((pageNo - 1) * pageSize).limit(pageSize)

  let obj = {
    list:result,
    total: allData.length
  }
  ctx.body = {
    code: 200,
    content: obj,
    message: '查找成功',
    success: true
  }
});
module.exports = router