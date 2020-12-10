// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
  constructor(data) {
    this.data = data;
    this._id = null; // 用户自定义 存放userid
    this._date = null; // 过期时间
    this._creatDate = null; // 创建时间
  }
  // 重新生成 token
  refreshToken() {
    let data = this.data;
    let created = Math.floor(Date.now() / 1000);
    let cert = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));// 私钥 可以自己生成
    let token = jwt.sign({
      data,
      exp: created + 60 * 60 * 24, // 过期时间  60 秒 * 60分钟 * 24小时  ===  1天
      iat: created // 创建时间
    }, cert, { algorithm: 'RS256' });
    return token;
  }
  // 生成token
  generateToken(data) {
    if (data) {
      this.data = data;
    }
    data = this.data;
    let created = Math.floor(Date.now() / 1000);
    let cert = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));// 私钥 可以自己生成
    let token = jwt.sign({
      data,
      exp: created + 60 * 60 * 24, // 过期时间  60 秒 * 60分钟 * 24小时  ===  1天
      iat: created // 创建时间
    }, cert, { algorithm: 'RS256' });
    return token;
  }

  // 校验token
  verifyToken(data) {
    if (data) {
      this.data = data;
    }
    let token = this.data;
    let cert = fs.readFileSync(path.join(__dirname, '../pem/public_key.pem'));// 公钥 可以自己生成
    let res;
    try {
      let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
      this._id = result.data;
      this._date = result.exp;
      this._creatDate = result.iat;
      let { exp = 0 } = result;
      let current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {}; // !得到data信息 就知道哪个account了。
      }
    } catch (e) {
      res = '';
    }
    return res;
  }
}

module.exports = new Jwt();
