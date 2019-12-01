
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
      options.content = `纬度:${message.Latitude};经度:${message.Longitude}`
    }
  } else if (message.MsgType === 'location') {
    options.content = `纬度:${message.Location_X};经度:${message.Location_Y};缩放:${message.Scale};位置信息:${message.Label};`
  }
  
  return options
} 