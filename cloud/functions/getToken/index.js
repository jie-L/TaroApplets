const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const APPID = 'wx6391276370ea8eb7'
const APPSECRET = '625d2657c8791eac218748d20d42a915'

cloud.init({
  env: 'jie-h4f74',
  traceUser: true
})
const db = cloud.database()
const tokenCollection = db.collection('gzhToken')
const ipList = db.collection('ipList')

setToken = async (token, allIp, allToken) => {
  var returnJson = {}
  var result = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'get'
  })
  var sucJson = (typeof result === 'object') ? result : JSON.parse(result);
  if (sucJson && sucJson.access_token) {
    await tokenCollection.doc(token._id).update({
      data: {
        access_token: sucJson.access_token,
        expires_in: new Date().getTime() + Number(sucJson.expires_in) * 1000,
        updateTime: db.serverDate(),
      },
      success: function (suc) {
        console.log('updateOK', suc)
      }
    });
    returnJson = {
      code: 200,
      message: 'access_token获取成功',
      access_token: sucJson.access_token
    }
  } else if (sucJson && sucJson.errcode && sucJson.errcode === 40164) {
    var curentIp = sucJson.errmsg.split(' ')[2]
    const [ip] = allIp.filter(v => v.ip === curentIp)
    if (!ip) {
      await ipList.add({
        data: {
          ip: curentIp,
          updateTime: db.serverDate(),
        },
        success: function (res) {
          console.log('ip添加成功', res)
        }
      })
      returnJson = {
        code: 201,
        message: 'ip添加成功，请添加到白名单',
        access_token: ''
      }
    } else {
      returnJson = {
        code: 201,
        message: 'ipList已有此ip，请添加到白名单',
        access_token: ''
      }
    }
  } else {
    returnJson = {
      code: 400,
      message: 'access_token获取失败',
      access_token: ''
    }
  }

  return returnJson
}

exports.main = async event => {

  try {
    const { type } = event
    const allToken = (await tokenCollection.get()).data
    const allIp = (await ipList.get()).data
    const [token] = allToken.filter(v => v._id === '1')
    console.log('查到的token', token)
    var returnJson = {}
    if (type === 'get') {
      if (token && !token.access_token) {
        returnJson = await setToken(token, allIp, allToken)
      } else {
        if (new Date().getTime() > token.expires_in) {
          returnJson = await setToken(token, allIp, allToken)
        } else {
          returnJson = {
            code: 200,
            message: '查询成功',
            access_token: token.access_token
          }
        }
      }

    } else if (type === 'set') {
      returnJson = await setToken(token, allIp, allToken)
    }
    return returnJson


  } catch (e) {
    console.error(e)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
}