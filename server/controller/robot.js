/*
 * @Desc: robot
 * @Author: lwp
 * @Date: 2020-04-24 21:09:47
 * @LastEditors: lwp
 * @LastEditTime: 2020-04-27 19:05:47
 */
const logger = require('../util/logger')
const { puppet_padplus_token } = require('../../config')
const { Wechaty, Friendship } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const qr = require('qr-image')
const { Robot } = require('../models/robot')
const { Group } = require('../models/group')
const { onMessage } = require('../robot')

let bot;  //机器人
let robot;
module.exports = {
  login: async (ctx) => {
    try {
      robot = await Robot.findOne({ _id: ctx.query.id })
      if (!robot) throw { message: '机器人不存在' }
      bot = new Wechaty({
        puppet: new PuppetPadplus({
          token: puppet_padplus_token
        }),
        name: robot.nickName
      })
      const result = await new Promise((resolve, reject) => {
        bot.on('scan', (qrcode) => {
          resolve(qrcode)
        }).on('login', onLogin)
          .on('message', onMessage(bot, robot))
          .on('friendship', onFriendShip)
          .on('room-join', onRoomJoin)
          .on('room-leave', onRoomLeave)
          .on('error', error => {
            logger.error('机器故障，error：' + error)
          })
          .on('logout', onLogout)
          .start()
      });
      const loginQrcode = qr.image(result, { type: 'png', size: 10 });
      ctx.type = 'image/png';
      ctx.body = { original: true, body: loginQrcode }
    } catch (err) { throw err }
  }
}
/**
 * 登录
 * @param {object} user 
 */
async function onLogin(user) {
  logger.info(`机器人${robot.nickName} 登陆啦!!!`)
  console.log(`机器人${robot.nickName} 登陆啦!!!`)
  await Robot.findByIdAndUpdate(robot._id, {
    status: 1, lastLoginT: new Date(), name: user.payload.name,
    id: user.id, weixin: user.payload.weixin, avatar: user.payload.avatar
  }, { new: true }).exec();
  const rooms = await bot.Room.findAll();
  for (let i = 0; i < rooms.length; i++) {
    const room = await Group.findOne({ id: rooms[i].id })
    if (!room) {
      rooms[i].payload.robotId = user.id
      await Group.create(rooms[i].payload)
      //await Group.update({id:rooms[i].id},rooms[i].payload)
    }
  }
  await bot.say(robot.startSay); //启动提示语
}
/**
 * 根据关键词自动通过好友请求
 * @param {object} friendship 
 */
async function onFriendShip(friendship) {
  let log;
  try {
    log = '添加好友' + friendship.contact().name();
    console.log(log);
    logger.info(log)
    switch (friendship.type()) {
      /**
       * 1.新的好友请求
       * 通过'request.hello()'获取验证消息
       * 通过'request.accept()'接受请求
       */
      case Friendship.Type.Receive:
        if (robot.addFriendKeywords.some(str => str === friendship.hello())) {
          log = `自动添加好友成功,因为验证消息是"${friendship.hello()}"`;
          //通过验证
          await friendship.accept();
        } else {
          log = `没有通过验证:因为关键词"${friendship.hello()}"不匹配`;
        }
        break;
      /**
       * 确认添加
       */
      case Friendship.Type.Confirm:
        log = `${friendship.contact().name()}已经添加你为好友`;
        //给自己发个提示
        bot.say(`${friendship.contact().name()}添加了你为好友`);
        await friendship.contact().say(`你好，我是机器人小助手${robot.nickName}\n\n加入技术交流群请回复 【加群】`);
        break;
    }
  } catch (e) {
    log = e.message;
  }
  logger.info(log)
  console.log(log);
}
/**
 * 进入房间
 * @param {String} room   群聊
 * @param {*} inviteeList 受邀者名单
 * @param {*} inviter 邀请者
 */
async function onRoomJoin(room, inviteeList, inviter) {
  const roomList = await Group.find({ robotId: robot.id }, { id: 1, roomJoinReply: 1 })
  //进入bot的房间会@并发送一条消息
  const myroom = roomList.find((item) => item.id == room.id)
  if (myroom) {
    inviteeList.map(c => {
      room.say('\n' + myroom.roomJoinReply, c)
    })
  }
}
/**
 * 踢出房间,此功能仅限于bot踢出房间,如果房间用户自己退出不会触发
 * @param {*} room 
 * @param {*} leaverList 
 */
async function onRoomLeave(room, leaverList) {
  const roomList = await Group.find({ robotId: robot.id }, { id: 1, roomJoinReply: 1 })
  const myroom = roomList.find((item) => item.id == room.id)
  if (myroom) {
    leaverList.map(c => {
      room.say(`「${c.name()}」被移除群聊`);
    });
  }
}
/**
 * 退出
 * @param {String} user 
 */
async function onLogout(user) {
  await Robot.findByIdAndUpdate(robot._id, { status: 0 }, {
    new: true
  }).exec();
  logger.info(`机器人${user} 退出`)
}
