module.exports = {
  dbs: 'mongodb://root:123456@127.0.0.1:27017/badminton-dbs?authSource=admin',
  //dbs: 'mongodb://127.0.0.1:27017/badminton-dbs',
  // !注意linux MongoDB数据库要这样设置  dbs: 'mongodb://root:123456@127.0.0.1:27017/express-stu?authSource=admin',  root:123456 账号密码?authSource=admin
  redis: {
    get host () { // 这种写法 其实相当于  host: '127.0.0.1'
      return '127.0.0.1'
    },
    get port () {
      return 6379
    }
  },
  smtp: {
    get host () {
      return 'smtp.qq.com'
    },
    get user () {
      return '214245088@qq.com'
    },
    get pass () {
      return 'bouskkripgmqbhdj' // 生成授权码
    },
    code: () => { return Math.random().toString(16).slice(2, 6).toUpperCase() },
    expire: () => { return new Date().getTime() + 60 * 1000 }
  }
  // get code () {
  //   return () => {
  //     return Math.random().toString(16).slice(2, 6).toUpperCase() // ! toString(16) 这里是转为16进制的意思 "4EF4"
  //   }
  // },
  // get expire () {
  //   return () => {
  //     return new Date().getTime() + 60 * 60 * 1000 // !一分钟 应该是  60 * 1000 就好吧
  //   }
  // }
}
