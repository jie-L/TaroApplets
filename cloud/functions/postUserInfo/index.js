const cloud = require("wx-server-sdk");
cloud.init({
    env: 'jie-h4f74',
    traceUser: true
})
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async event => {
    const { OPENID } = cloud.getWXContext();
    const { username, gender, avatarUrl, phone } = event;
    console.log('event', event);

    try {
        const [userRecord] = (await userCollection
            .where({
                openId: OPENID
            })
            .get()).data;
        console.log("查到的用户信息", userRecord);
        if (!userRecord) {
            return {
                code: 400,
                message: "用户不存在"
            };
        } else {
            await userCollection.doc(userRecord._id).update({
                data: {
                    username,
                    phone,
                    gender,
                    avatarUrl
                },
                success: function (suc) {
                    console.log('updateOK', suc)
                }
            });
        }
        return {
            code: 200,
            message: "ok",
            openId: OPENID,
            username,
            phone,
            gender,
            avatarUrl
        };

    } catch (e) {
        console.log(e);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
};