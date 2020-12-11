const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const userCollection = db.collection('user')

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  try {
    const allUser = (await userCollection.get()).data
    const [userInfo] = allUser.filter(v => v.openId === OPENID)
    console.log('查到的userInfo', userInfo)
    let username, avatarUrl, gender, phone
    // 无记录，加记录
    if (!userInfo) {
      await userCollection.add({
        data: {
          openId: OPENID,
          createdTime: db.serverDate(),
        },
      })
      // 有记录，返回用户信息
    } else {
      username = userInfo.username
      avatarUrl = userInfo.avatarUrl
      gender = userInfo.gender
      phone = userInfo.phone
    }
    return {
      username: username || null,
      avatarUrl: avatarUrl || null,
      gender: gender || null,
      phone: phone ||  null,
      openId: OPENID,
    }
  } catch (e) {
    console.error(e)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
}