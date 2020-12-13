const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init({
  env: 'jie-h4f74',
  traceUser: true
})
const db = cloud.database()
const articleCollection = db.collection('articleList')

getArticleList = async data => {
  var returnJson = {}
  var result = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${data.access_token}`,
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })
  const allarticle = (await articleCollection.get()).data
  var sucJson = (typeof result === 'object') ? result : JSON.parse(result);
  console.log(sucJson)
  const itemList = sucJson.item
  if (sucJson && sucJson.item_count) {
    console.log(1)
    var list = allarticle
    if (list.length > 0) {
      console.log('length 0', allarticle)

      for (var j = 0; j < itemList.length; j++) {
        const atricleitem = (await articleCollection.where({ media_id: itemList[j].media_id }).get()).data;
        if (atricleitem && atricleitem[0]) {
          await articleCollection.doc(atricleitem[0]._id).update({
            data: {
              ...itemList[j],
              type: data.type
            },
            success: function (suc) {
              console.log('updateOK', suc)
            }
          });
        } else {
          await articleCollection.add({
            data: {
              ...itemList[j],
              type: data.type
            },
            success: function (res) {
              console.log('ip添加成功', res)
            }
          })
        }
      }

    } else {
      console.log('length 1')
      for (var j = 0; j < itemList.length; j++) {
        await articleCollection.add({
          data: {
            ...itemList[j],
            type: data.type
          },
          success: function (res) {
            console.log('ip添加成功', res)
          }
        })
      }
    }

    returnJson = {
      code: 200,
      message: '文章获取成功',
      data: sucJson
    }
  } else {
    returnJson = {
      code: 400,
      message: '文章获取失败',
    }
  }

  return returnJson
}

exports.main = async event => {
  console.log(event)
  try {
    var returnJson = {}
    returnJson = await getArticleList(event)
    return returnJson


  } catch (e) {
    console.error(e)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
}