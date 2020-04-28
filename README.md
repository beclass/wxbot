# wechat-robot
基于 nodejs，wechaty，vue，nuxt 个人微信号机器人平台，现代化的 UI 和用户体验

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
## 界面预览
* 首页
![首页](http://pic.loveyh.com/wxbot-1.png)
* 后台管理
![控制台](http://pic.loveyh.com/wxbot-2.png)
![控制台](http://pic.loveyh.com/wxbot-3.png)
![我的群聊](http://pic.loveyh.com/wxbot-4.png)

## 在线实例
 [http://94.191.126.174:8081](http://94.191.126.174:8081)    
 用户名：guest   密码：111111
 #### 目前实现功能
 
- 自动通过好友验证
  - 当有人添加机器人时，判断验证消息关键字后通过或直接通过
  - 通过验证后并自动回复添加者
- 私聊关键字回复
  - 例如回复 `加群` 推送群聊邀请
- 智能聊天
  - 群聊中通过 `@[机器人]xxx` 可以和机器人聊天
  - 私聊发送消息即可聊天
- 群聊设置
  - 设置入群欢迎语：当新的小伙伴加入群聊后自动 `@[新加入者]` 发一个文字欢迎
  - 是否开启自动加群：当你有多个群的时候，有的群不想通过机器人推送群邀请，则可以关闭
  

## 技术构成

* SDK[wechaty](https://wechaty.github.io/wechaty/)
* ipad协议 [wechaty-puppet-padplus](https://github.com/wechaty/wechaty-puppet-padplus/)
* 服务端 [Node.js](https://nodejs.org/)
* SSR框架 [NuxtJS](https://nuxtjs.org/)
* 前端框架 [Vue](https://vuejs.org/)
* UI组件 [Ant Design of Vue](https://www.antdv.com/docs/vue/introduce-cn/)
* 持久化 [MongoDB](https://www.mongodb.org/)
* 身份验证 [@nuxtjs/auth](https://auth.nuxtjs.org/)

## 快速开始

### 准备条件

安装 [Node.js](https://nodejs.org/en/download/) (v10 以上版本)、[MongoDB](https://www.mongodb.org/downloads/)。  
推荐安装 [cnpm](https://cnpmjs.org/) 

### 安装依赖
```Shell
$ cnpm i
```

### 启动站点

* 开发模式

```Shell
$ npm run dev
```

* 生产模式

先编译项目
```shell
$ npm run build
```

再启动站点
```shell
$ npm start
```

打开浏览器，访问 [http://localhost:3000/](http://localhost:3000)


## 系统设置

根据实际情况修改 `config.js` 配置文件，修改后需要重启服务器才能生效。  
参数说明：

#### host
`String` 类型，主机名，配置为 `0.0.0.0` 表示监听任意主机。

#### port
`Number` 类型，端口号。

#### mongoUrl
`String` 类型，MongoDB 链接。

#### secret
`String` 类型，[JWT](https://github.com/auth0/node-jsonwebtoken) 秘钥。

#### puppet_padplus_token
`String` ipad协议 token

#### tianApiKey
`String` 天行机器人秘钥

## 线上部署

### 使用PM2
推荐使用 [pm2](https://pm2.keymetrics.io/) 进行 Node.js 的进程管理和持久运行。

#### 安装
```Shell
$ cnpm i -g pm2
```
#### 启动
```Shell
$ pm2 start pm2.config.js
```

#### 最后

### 好心的朋友赏个star，谢谢啦☕️

欢迎添加我的小助手【小小】微信体验下哦，验证消息写【机器人】可以直接通过，和她聊聊天，或者加技术交流群一起交流。

![WechatIMG127](http://pic.loveyh.com/wxbot-wechat.png)

