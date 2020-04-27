
const router = require('koa-router')()
const getUser= require('../middleware/getUser')
const sysCtrl = require('../controller/sys')
const robotCtrl = require('../controller/robot')
router.prefix('/api')
//登录
router.post('/auth/login', sysCtrl.login)
router.get('/auth/user', getUser(),sysCtrl.getUser)
router.get('/admin/robot',getUser(),sysCtrl.getRobot)
router.post('/admin/robot',getUser(),sysCtrl.addRobot)
router.put('/admin/robot/:id',sysCtrl.updateRobot)
router.get('/admin/group',getUser(),sysCtrl.getGroups)
router.put('/admin/group/:id',sysCtrl.updateGroup)
router.get('/robot/login',robotCtrl.login)
// 退出登录
router.post('/auth/logout',async(ctx) => {
    ctx.body = null
});
module.exports = router