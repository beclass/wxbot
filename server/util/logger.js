/*
 * @Desc: logger
 * @Author: lwp
 * @Date: 2020-04-26 14:28:26
 * @LastEditors: lwp
 * @LastEditTime: 2020-04-26 14:29:32
 */
const log4js = require('log4js');
let log_config = require('../config/log4js');
//加载配置文件
log4js.configure(log_config);
let logUtil = {};
//调用预先定义的日志名称
const resLogger = log4js.getLogger("resLogger");
const errorLogger = log4js.getLogger("errorLogger");
const infoLogger = log4js.getLogger("infoLogger");
const consoleLogger = log4js.getLogger();
//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};
logUtil.error = function (err) {
  errorLogger.error(err);
};
logUtil.info = function (info) {
  infoLogger.info(info);
};
//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};
logUtil.logInfo = function (info) {
  if (info) {
    consoleLogger.info(formatInfo(info));
  }
};
const formatInfo = function (info) {
  let logText = new String();
  //响应日志开始
  logText += "\n" + "***************info log start ***************" + "\n";
  //响应内容
  logText += "info detail: " + "\n" + JSON.stringify(info) + "\n";
  //响应日志结束
  logText += "*************** info log end ***************" + "\n";
  return logText;
}
//格式化响应日志
const formatRes = function (ctx, resTime) {
  let logText = new String();
  //响应日志开始
  logText += "\n" + "*************** response log start ***************" + "\n";
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //响应状态码
  logText += "response status: " + ctx.status + "\n";
  //响应内容
  logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";
  //响应日志结束
  logText += "*************** response log end ***************" + "\n";
  return logText;
}
//格式化错误日志
const formatError = function (ctx, err, resTime) {
  let logText = new String();
  //错误信息开始
  logText += "\n" + "*************** error log start ***************" + "\n";
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //错误名称
  logText += "err name: " + err.name + "\n";
  //错误信息
  logText += "err message: " + err.message + "\n";
  //错误详情
  logText += "err stack: " + err.stack + "\n";
  //错误信息结束
  logText += "*************** error log end ***************" + "\n";
  return logText;
};
//格式化请求日志
const formatReqLog = function (req, resTime) {
  let logText = new String();
  const method = req.method;
  //访问方法
  logText += "request method: " + method + "\n";
  //请求原始地址
  logText += "request originalUrl:  " + req.originalUrl + "\n";
  //客户端ip
  logText += "request client ip:  " + req.ip + "\n";
  //开始时间
  let startTime;
  //请求参数
  if (method === 'GET') {
    logText += "request query:  " + JSON.stringify(req.query) + "\n";
    // startTime = req.query.requestStartTime;
  } else {
    logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    // startTime = req.body.requestStartTime;
  }
  //服务器响应时间
  logText += "response time: " + resTime + "\n";
  return logText;
}
module.exports = logUtil;