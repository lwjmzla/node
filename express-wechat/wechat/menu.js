module.exports = {
  "button": [{
      "type": "click",
      "name": "今日歌曲",
      "key": "V1001_TODAY_MUSIC"
    },
    {
      "name": "菜单1",
      "sub_button": [{
          "type": "view",
          "name": "搜索",
          "url": "http://www.soso.com/"
        },
        // { // !小程序
        //   "type": "miniprogram",
        //   "name": "wxa",
        //   "url": "http://mp.weixin.qq.com",
        //   "appid": "wx286b93c14bbf93aa",
        //   "pagepath": "pages/lunar/index"
        // },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "rselfmenu_0_0"
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "rselfmenu_0_1"
        },
        // {
        //   "type": "media_id",
        //   "name": "点击按钮发图片",
        //   "media_id": "MEDIA_ID1"
        // },
        // {
        //   "type": "view_limited",
        //   "name": "点击按钮发图文消息",
        //   "media_id": "MEDIA_ID2"
        // }
      ]
    },
    {
      "name": "发图",
      "sub_button": [{
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0"
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1"
        },
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2"
        },
        {
          "name": "发送位置",
          "type": "location_select",
          "key": "rselfmenu_2_0"
        },
        {
          "type": "click",
          "name": "就要点击",
          "key": "click1"
        },
      ]
    },
  ]
}