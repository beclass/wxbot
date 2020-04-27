const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  nickName: String,
  startSay: String, //启动机器人提示语
  unknownSay: String,  // 知识盲区回复语
  addFriendKeywords: Array, //好友验证自动通过关键字
  addFriendReply: String, //添加好友之后回复内容
  name: String,
  avatar: String,
  id: String,
  weixin: String,
  status: { type: Number, default: 0 }, //状态 0未启动 1已启动 
  user: { type: Schema.Types.ObjectId, ref: 'auth' },
  createTime: { type: Date, default: new Date() },
  modifyTime: { type: Date, default: new Date() },
  lastLoginT: Date,
  lastLoginIp: String,
})

const Robot = mongoose.model('robot', schema, 'robot')

module.exports = {
  Robot
}

