/*
 * @Desc: 消息监听
 * @Author: lwp
 * @Date: 2020-04-26 15:27:24
 * @LastEditors: lwp
 * @LastEditTime: 2020-05-14 14:18:06
 */
const { Message } = require('wechaty')
const { Group } = require('../../models/group')
const { Robot } = require('../../models/robot')
const { Reply } = require('../../models/reply')
const { Memory } = require('../../models/memory')
const { v1 } = require('node-uuid')
const crypto = require('crypto')
let md5 = crypto.createHash('md5')
const uniqueId = md5.update(v1()).digest('hex')
const TXHOST = 'http://api.tianapi.com/txapi/'
const { tianApiKey } = require('../../../config')
const urllib = require('urllib')

async function onMessage(msg) {
  if (msg.self()) return
  console.log("=============================")
  console.log(`msg : ${msg}`)
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${
    msg.from() ? msg.from().id : null
    }`
  )
  if (msg.type() == Message.Type.Text) {  //文本消息
    if (msg.room()) { //消息来自群聊
      let room = await msg.room()
      const group = await Group.findOne({ id: room.id }, { control: 1 })
      if (!group||!group.control) return
      if (await msg.mentionSelf()) {  //@了机器人
        //获取提到自己的名字
        let self = await msg.to()
        self = '@' + self.name()
        //获取消息内容并去掉 @+名字
        let sendText = msg.text().replace(self, '')
        sendText = sendText.trim()
        // 获取需要回复的内容
        let content = await keyWordReply(sendText, room.id)
        if (!content) {
          content = await getReply(sendText)
        }
        // 返回消息，并@来自人
        if (sendText !== 'help') {
          return room.say(content, msg.from())
        }
        room.say(content)
        return
      }
      //没有@机器人
      let sendText = msg.text()
      let person = false
      if (sendText.indexOf('@') == 0) {
        const str = sendText.replace('@', '').split(' ')
        if (!str[1]) return
        person = str[0]
        sendText = str[1]
      }
      let content = await keyWordReply(sendText, room.id, person, room)
      if (content) {
        if (person) {
          content = `@${person} ${content}`
        } else {
          content = `「${msg.from().name()}：${msg.text()}」\n- - - - - - - - - - - - - - -\n${content}`
        }
        room.say(content)
      }
      return
    }
    //一对一聊天消息
    if (await isRoomName(msg)) return  // 收到消息是群聊名
    let content = await keyWordReply(msg.text())
    if (!content) {
      content = await getReply(msg.text())
    }
    await msg.say(content)
    return
  }
  //console.log("不是文本消息")
}
/**
 * @description 收到消息是否群聊名称
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} 
 */
async function isRoomName(msg) {
  const group = await Group.findOne({ joinCode: msg.text() }, { id: 1 })
  if (group) {
    //通过群聊id获取群聊实例
    const room = await bot.Room.find({ id: group.id })
    // 判断是否在房间中 在-提示并结束
    if (await room.has(msg.from())) {
      await msg.say('您已经在群聊中了')
      return true
    }
    // 发送群邀请
    await room.add(msg.from())
    await msg.say('已发送群邀请')
    return true
  }
  return false
}
/**
 * 自定义回复
 * @param {string} keyword 关键字
 * @param {string} roomId 群聊id
 * @param {string} person 艾特的群成员
 * @param {string} room 群聊
 */
async function keyWordReply(keyword, roomId, person, room) {
  try {
    const res = await Reply.findOne({ keyword: keyword, status: 1 }, { content: 1, type: 1, factor: 1, roomId: 1 })
    if (!res) return false
    if (roomId) { //群聊
      if (res.type == 0) { //普通消息
        if (res.factor == 0 || res.factor == 3) return res.content  //通用
        if (res.factor == 2 && roomId == res.roomId) return res.content //属于此群聊
      }
      if (res.type == 2) { //踢人
        if (person) {
          const group = await Group.findOne({ id: roomId }, { maxFoul: 1 })
          let foulCount = await Memory.countDocuments({ person: person, cmd: keyword, roomId: roomId })
          if (group.maxFoul - 1 == foulCount) {
            const contact = await bot.Contact.find({ name: person })
            await room.del(contact)
            await Memory.deleteMany({ person: person, roomId: roomId })
          } else {
            await Memory.create({ person: person, cmd: keyword, roomId: roomId })
            foulCount++
            return `您一定是违反了群的相关规则，如果再收到${group.maxFoul - foulCount}次同类消息，您将被移出本群。`
          }
        }
      }
      return false
    }
    //私聊
    if (res.type == 1) { //群邀请
      const robot = await Robot.findOne({ id: bot.id }, { id: 1, nickName: 1 })
      const roomList = await Group.find({ robotId: robot.id, autojoin: true }, { topic: 1, id: 1, joinCode: 1 })
      let content = `${robot.nickName}管理群聊有${roomList.length}个：\n\n`
      roomList.forEach(item => {
        content += `${item.joinCode}：【${item.topic}】\n`
      })
      content += '\n回复字母即可加入对应的群哦，比如发送 ' + roomList[0].joinCode
      return content
    }
    if (res.factor == 0 || res.factor == 1) return res.content //通用
    return false
  } catch (err) { return false }
}

/**
 * @description 机器人回复内容
 * @param {String} 收到消息
 * @return {Promise} 响应内容
 */
async function getReply(keyword) {
  let url = TXHOST + 'robot/';
  const pkg = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      key: tianApiKey,
      question: keyword,
      mode: 1,
      datatype: 0,
      userid: uniqueId,
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
module.exports = onMessage