/*
 * @Desc: 消息
 * @Author: lwp
 * @Date: 2020-04-26 15:27:24
 * @LastEditors: lwp
 * @LastEditTime: 2020-04-27 19:04:14
 */
const { Message } = require('wechaty')
const { Group } = require('../models/group')
const { v1 } = require('node-uuid')
const crypto = require('crypto')
let md5 = crypto.createHash('md5')
const uniqueId = md5.update(v1()).digest('hex') //唯一id
const TXHOST = 'http://api.tianapi.com/txapi/'
const { tianApiKey } = require('../../config')
const urllib = require('urllib')
module.exports = (bot, robot) => {
  return async function onMessage(msg) {
    //消息来自自己
    if (msg.self()) return
    console.log("=============================")
    console.log(`msg : ${msg}`)
    console.log(
      `from: ${msg.from() ? msg.from().name() : null}: ${
      msg.from() ? msg.from().id : null
      }`
    )
    //文本消息
    if (msg.type() == Message.Type.Text) {
      //消息来自群聊
      if (msg.room()) {
        if (await msg.mentionSelf()) {  //@了机器人
          const room = await msg.room()
          //获取提到自己的名字
          let self = await msg.to()
          self = "@" + self.name()
          //获取消息内容并去掉 @+名字
          const sendText = msg.text().replace(self, "")
          // 获取需要回复的内容
          const content = await getReply(sendText)
          // 返回消息，并@来自人
          room.say(content, msg.from())
          return
        }
        // 没有@机器人 消息忽略
        return
      }
      //一对一聊天消息
      // 收到消息是 “加群”
      if (await isJoinRoom(msg, robot)) return
      // 收到消息是 群聊名
      if (await isRoomName(bot, msg)) return
      // 获取需要回复的内容
      const content = await getReply(msg.text())
      // 回复消息
      await msg.say(content)
      return
    }
    console.log("不是文本消息")
  }
}
/**
 * @description 是否加群关键词
 * @param {object} msg 
 * @return {Promise} 
 */
async function isJoinRoom(msg, robot) {
  //关键字 加群 处理
  if (msg.text() == "加群") {
    const roomList = await Group.find({ robotId: robot.id, autojoin: true }, { topic: 1, id: 1 })
    let content = `${robot.nickName}管理群聊有${roomList.length}个，回复群聊名即可加入哦\n\n`
    roomList.forEach(item => {
      content += "【" + item.topic + "】" + "\n"
    })
    msg.say(content)
    return true
  }
  return false
}

/**
 * @description 收到消息是否群聊名称
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} 
 */
async function isRoomName(bot, msg) {
  const group = await Group.findOne({ topic: msg.text() }, { id: 1 })
  if (group) {
    //通过群聊id获取群聊实例
    const room = await bot.Room.find({ id: group.id })
    // 判断是否在房间中 在-提示并结束
    if (await room.has(msg.from())) {
      await msg.say("您已经在群聊中了")
      return true
    }
    // 发送群邀请
    await room.add(msg.from())
    await msg.say("已发送群邀请")
    return true
  }
  return false
}

/**
 * @description 回复内容
 * @param {String} info 收到消息
 * @return {Promise} 响应内容
 */
async function getReply(word) {
  let url = TXHOST + 'robot/';
  const pkg = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      key: tianApiKey,
      question: word, //提问
      mode: 1, //工作模式，宽松0[默认]、精确1，私有2
      datatype: 0, //返回类型，文本0[默认]、语音1
      userid: uniqueId, //机器人上下文关联，必须唯一采用md5
      limit: 1
    },
    encoding: null,
    timeout: 5000,
  }
  let { status, data } = await urllib.request(url, pkg)
  if (status !== 200) return '不好意思，我断网了'
  data = JSON.parse(data.toString())
  if (data.code != 200) return '我累啦，等我休息好再来哈'
  return data.newslist[0].reply
}