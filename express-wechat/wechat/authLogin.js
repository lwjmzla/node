
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const config = require('../config/index.js')
class AuthLogin {
  constructor () {
  }
  async getOpenidFromWechatServer () {
    // !也可以用  return new Promise((resolve,reject) => { axios.xxx  resolve对应数据  })
    //let {data} = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`)
    let {data} = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appid}&secret=${config.appsecret}&code=${this.code}&grant_type=authorization_code`)
    // !自定义提前5分钟到期
    data.expires_in = new Date().getTime() + (data.expires_in - 300) * 1000
    console.log(data)
    return data
  }
  // !其实可以考虑存到数据库的
  saveOpenidToTxt (res) {
    fs.writeFileSync(path.join(__dirname, './openid.txt'), JSON.stringify(res))
  }
  async readOpenidFromTxt () {
    try {
      //! 找到openid.txt
      console.log(1)
      let data = fs.readFileSync(path.join(__dirname, './openid.txt')).toString() //!把buffer对象转换
      // !如果readFileSync  报错，当前代码块剩下的代码就不会执行（data = JSON.parse(data)，return data），直接跳去catch
      data = JSON.parse(data)
      if (this.isValidOpenid(data)) {
        console.log(3)
        return data
      } else {
        console.log(4)
        let res = await this.getOpenidFromWechatServer()
        this.saveOpenidToTxt(res)
        return res
      }
    } catch (error) {
      console.log(error)
      console.log(2)
      //! 找不到openid.txt
      // !调用async函数的    返回值也是 promise
      let res = await this.getOpenidFromWechatServer()
      this.saveOpenidToTxt(res)
      return res
    }
  }
  isValidOpenid (data) {
    if (data.access_token && data.expires_in && new Date().getTime() < data.expires_in) {
      return true
    } else {
      return false
    }
  }
  /*
    先读取openid.txt
    -本地有文件
      判断是否过期(isValidOpenid)
      -过期了
        重新获取先读取openid(getOpenidFromWechatServer)，保存覆盖txt(saveOpenidToTxt)并使用
      -没过期
        直接返回
    -本地无文件
      获取openid(getOpenidFromWechatServer)，保存覆盖txt(saveOpenidToTxt)并使用
  */
  async fetchValidOpenid (appid,code) {
    this.appid = appid
    this.code = code
    return await this.readOpenidFromTxt()
  }
  async fetchValidUserInfo (appid,code) {
    const {openid,access_token} = await this.fetchValidOpenid(appid,code)
    // console.log(openid)
    // console.log(access_token)
    let {data} = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    console.log(data)
    return data
  }
}
module.exports = AuthLogin