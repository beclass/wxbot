const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  id: String,
  adminIdList: Array,
  avatar: String,
  ownerId: String,
  topic: String,
  memberIdList: { type: Array },
  robotId: String,
  roomJoinReply: { type: String, default: '你好，欢迎加入!' },
  autojoin: { type: Boolean, default: true },
  joinCode: String,//群代号
})

const Group = mongoose.model('group', schema, 'group')
const { Robot } = require('./robot')
module.exports = {
  Group,
  Dao: {
    myGroups: async (user) => {
      try {
        const robot = await Robot.findOne({ user: user }, { id: 1 })
        if (!robot) throw { message: '未创建机器人' }
        const result = await Group.find({ robotId: robot.id, ownerId: robot.id })
        return result
      } catch (err) { throw err }
    },
    update: async (id, params) => {
      try {
        const result = await Group.findByIdAndUpdate(id, params, {
          new: true
        }).exec();
        return result
      } catch (err) { throw err }
    },
  }
}