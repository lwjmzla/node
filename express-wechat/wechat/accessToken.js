
//!获取有效的accessToken
const axios = require('axios')
const fs = require('fs')
const config = require('../config/index.js')
class Wechat {
  constructor () {
  }
  async getAccessTokenFromWechatServer () {
    // !也可以用  return new Promise((resolve,reject) => { axios.xxx  resolve对应数据  })
    let {data} = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`)
    // !自定义提前5分钟到期
    data.expires_in = new Date().getTime() + (data.expires_in - 300) * 1000
    return data
  }
  // !其实可以考虑存到数据库的
  saveAccessTokenToTxt (res) {
    fs.writeFileSync('./accessToken.txt', JSON.stringify(res))
  }
  async readAccessTokenFromTxt () {
    try {
      //! 找到accessToken.txt
      console.log(1)
      let data = fs.readFileSync('./accessToken.txt').toString() //!把buffer对象转换
      // !如果readFileSync  报错，当前代码块剩下的代码就不会执行（data = JSON.parse(data)，return data），直接跳去catch
      data = JSON.parse(data)
      if (this.isValidAccessToken(data)) {
        console.log(3)
        return data
      } else {
        console.log(4)
        let res = await this.getAccessTokenFromWechatServer()
        this.saveAccessTokenToTxt(res)
        return res
      }
    } catch (error) {
      console.log(error)
      console.log(2)
      //! 找不到accessToken.txt
      // !调用async函数的    返回值也是 promise
      let res = await this.getAccessTokenFromWechatServer()
      this.saveAccessTokenToTxt(res)
      return res
    }
  }
  isValidAccessToken (data) {
    if (data.access_token && data.expires_in && new Date().getTime() < data.expires_in) {
      return true
    } else {
      return false
    }
  }
  /*
    先读取accessToken.txt
    -本地有文件
      判断是否过期(isValidAccessToken)
      -过期了
        重新获取先读取accessToken(getAccessTokenFromWechatServer)，保存覆盖txt(saveAccessTokenToTxt)并使用
      -没过期
        直接返回
    -本地无文件
      获取accessToken(getAccessTokenFromWechatServer)，保存覆盖txt(saveAccessTokenToTxt)并使用
  */
  async fetchValidAccessToken () {
    return await this.readAccessTokenFromTxt()
  }

}
new Wechat().fetchValidAccessToken().then((res) => {
  console.log(res)
})
// !主要是调用 new Wechat().fetchValidAccessToken().then((res) => {  来获取accessToken
module.exports = Wechat