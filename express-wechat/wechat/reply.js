
module.exports = (message) => {
  let options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: new Date().getTime(),
    msgType: 'text'
  }

  if (message.MsgType === 'text') {
    options.content = '我爱你'
  } else if (message.MsgType === 'image') {
    options.msgType = 'image'
    options.mediaId = message.MediaId
  } else if (message.MsgType === 'voice') {
    options.msgType = 'voice'
    options.mediaId = message.MediaId
    console.log(message.Recognition) // 语音识别结果，普通话的
  } else if (message.MsgType === 'event') {
    if (message.Event === 'LOCATION') {
      options.content = `纬度:${message.Latitude};经度:${message.Longitude};精度:${message.Precision}`
    } else if (message.Event === 'subscribe') {
      options.content = '感谢订阅'
      if(message.EventKey) {
        options.content = '用户扫码带参数的订阅'
      }
    } else if (message.Event === 'unsubscribe') {
      options.content = '感谢取消订阅'
    } else if (message.Event === 'SCAN') {
      options.content = `用户已关注过，用户扫码带参数的订阅`
    } else if (message.Event === 'CLICK') {
      options.content = `你点击了按钮:${message.EventKey}`
    } else if (message.Event === 'scancode_waitmsg') {
      options.content = `scancode_waitmsg key:${message.EventKey}`
    } else if (message.Event === 'scancode_push') { // ! 不知怎么玩
      options.content = `scancode_push key:${message.EventKey}`
    }

  } else if (message.MsgType === 'location') {
    options.content = `纬度:${message.Location_X};经度:${message.Location_Y};缩放:${message.Scale};位置信息:${message.Label};`
  }
  
  return options
} 