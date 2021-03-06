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
      remark = remark || '充值'
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
  // await ConsumeRecord.find({memberCode}).sort({'createTime':-1})
  // result.forEach(async (item) => { // !注意函数里用await 记得要使用async 否则代码报错，但提示不明显
  //   let arr = await ConsumeRecord.find({memberCode: item.memberCode, operateType: 'minus'}).sort({'createTime':-1}) // !找到最新消费的数据
  //   if (arr.length) {
  //     item.lastConsumeContent = arr[0].remark
  //     item.lastConsumeTime = arr[0].createTime
  //   }
  // })
  for(let i=0;i<result.length;i++) {
    let item = result[i]
    let arr = await ConsumeRecord.find({memberCode: item.memberCode, operateType: 'minus'}).sort({'createTime':-1}) // !找到最新消费的数据
    if (arr.length) {
      // !结论：mongodb中使用mongoose取到的对象不能增加Schema以外的属性。https://www.cnblogs.com/fhen/p/5322493.html
      // !注意 result数据是从Member的Schema得到的，所以不能贸然给对象添加Schema以外的属性,如果需要添加，需要在Schema定义才能成功添加，否则添加无效。
      item.lastConsumeContent = arr[0].remark 
      item.lastConsumeTime = arr[0].createTime
    }
  }
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

router.post('/operateMoney', async (ctx) => {
  const {body} = ctx.request
  console.log(body)
  let {
    memberCode,
    operateType,
    remark,
    operateAmount,
    amountAfterOperate
  } = body
  const createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  if (operateType === 'plus' && !remark) {
    remark = '充值'
  }
  await ConsumeRecord.create({
    memberCode,
    operateType,
    remark,
    createTime,
    operateAmount,
    amountAfterOperate
  })
  await Member.where({memberCode}).update({
    updateTime: createTime,
    amount: amountAfterOperate
  })
  ctx.body = {
    code: 200,
    content: null,
    message: operateType === 'plus' ? '充值成功' : '消费成功',
    success: true
  }
});

router.get('/getConsumeRecord', async (ctx) => {
  const {query} = ctx.request
  let {memberCode} = query
  const result = await ConsumeRecord.find({memberCode}).sort({'createTime':-1})
  ctx.body = {
    code: 200,
    content: result,
    message: '查找成功',
    success: true
  }
});
module.exports = router