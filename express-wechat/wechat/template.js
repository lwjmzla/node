
module.exports = (options) => {
  let replyMessage = ''
  let commonXml = `
    <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
    <CreateTime>${options.createTime}</CreateTime>
    <MsgType><![CDATA[${options.msgType}]]></MsgType>
  `
  if (options.msgType ==='text') {
    replyMessage = `
      <xml>
        ${commonXml}
        <Content><![CDATA[${options.content}]]></Content>
      </xml>
    `
  } else if (options.msgType ==='image') {
    replyMessage = `
      <xml>
        ${commonXml}
        <Image>
          <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        </Image>
      </xml>
    `
  } else if (options.msgType ==='voice') {
    replyMessage = `
      <xml>
        ${commonXml}
        <Voice>
          <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        </Voice>
      </xml>
    `
  } else if (options.msgType ==='video') {
    replyMessage = `
      <xml>
        ${commonXml}
        <Video>
          <MediaId><![CDATA[${options.mediaId}]]></MediaId>
          <Title><![CDATA[${options.title}]]></Title>
          <Description><![CDATA[${options.description}]]></Description>
        </Video>
      </xml>
    `
  } else if (options.msgType ==='music') {
    replyMessage = `
      <xml>
        ${commonXml}
        <Music>
          <Title><![CDATA[${options.title}]]></Title>
          <Description><![CDATA[${options.description}]]></Description>
          <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
          <HQMusicUrl><![CDATA[${options.hQMusicUrl}]]></HQMusicUrl>
          <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
        </Music>
      </xml>
    `
  } else if (options.msgType ==='news') {
    replyMessage = `
      <xml>
        ${commonXml}
        <ArticleCount>1</ArticleCount>
        <Articles>
          <item>
            <Title><![CDATA[title1]]></Title>
            <Description><![CDATA[description1]]></Description>
            <PicUrl><![CDATA[picurl]]></PicUrl>
            <Url><![CDATA[url]]></Url>
          </item>
        </Articles>
      </xml>
    `
  }
  return replyMessage
}