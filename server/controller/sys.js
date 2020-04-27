const authDB = require('../models/auth')
const groupDB = require('../models/group')
module.exports = {
  login: async (ctx) => {
    try {
      const result = await authDB.Dao.login(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  getUser: async (ctx) => {
    try {
      const result = await authDB.Dao.getUser(ctx.query.user)
      ctx.body = { user: result }
    } catch (err) { throw err }
  },
  getRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.getRobot(ctx.query.user)
      ctx.body = result
    } catch (err) { throw err }
  },
  addRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.addRobot(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.updateRobot(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  getGroups: async (ctx) => {
    try {
      const result = await groupDB.Dao.myGroups(ctx.query.user)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateGroup: async (ctx) => {
    try {
      const result = await groupDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
}
