const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config')
const encryptPassword = (salt, password) => {
  const str = salt + password;
  const md5 = crypto.createHash('sha1');
  md5.update(str);
  return md5.digest('hex');
}
const generateStr = (len, charType) => {
  len = len || 6;
  charType = charType || 'number';
  const chars1 = 'ABCDEFGHJKMNPQRSTUVWXYabcdefghjkmnpqrstuvwxy';
  const chars2 = '0123456789';
  let chars = charType === 'string' ? chars1 : chars2;
  const maxPos = chars.length;
  let str = '';
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

const createToken = (payload = {}, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn: expiresIn || '24h' });
}

const verifyToken = (token) => {
  return jwt.verify(token.split(' ')[1], secret);
}

module.exports = { encryptPassword, generateStr, createToken, verifyToken }