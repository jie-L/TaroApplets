import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button, CoverImage } from "@tarojs/components"

import './index.weapp.less'

export default class Login extends Component {
  state = {
    userInfo: {},
    context: {},
    isLogin: false
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  login = ev => {
    Taro.cloud
      .callFunction({
        name: 'login',
      })
      .then(res => {
        // console.log('用户信息', res)
        this.setState({
          userInfo: res.result,
        }, () => {
          this.getUserInfo(ev)
        })
      })
      .catch(console.log)
  }

  getUserInfo = e => {
    console.log(e)
    const { detail } = e
    if (detail.errMsg.endsWith('ok')) {
      const userInfo = JSON.parse(detail.rawData)
      const { nickName, gender, avatarUrl } = userInfo
      Taro.cloud
        .callFunction({
          name: 'postUserInfo',
          data: {
            username: nickName,
            gender: gender,
            avatarUrl: avatarUrl,
          },
        })
        .then(res => {
          // console.log(res)
          try {
            Taro.setStorageSync("userInfo", JSON.stringify(res.result))
          } catch (e) { }
          this.setState({
            context: res.result,
            isLogin: true
          })
        })
    }
  }

  linkHome = () => {
    Taro.switchTab({
      url: '../../pages/home/home',
      success: function (res) {
        // console.log(res)
      },
      fail: function (err) {
        // console.log(err)
      }
    })
  }

  render() {
    const { context } = this.state
    return (
      <View className='index'>
        {/* <Text>userInfo：{JSON.stringify(this.state.userInfo)}</Text> */}
        <View className="userinfo">
          <Text>{context.username}</Text>
          {context.avatarUrl && (<CoverImage src={context.avatarUrl} />)}
        </View>
        {!isLogin ? (
          <Button
            className="okbutton"
            openType='getUserInfo'
            onGetUserInfo={this.login}
          >
            授权登录
          </Button>
        ) : (
            <Button
              className="okbutton"
              onClick={this.linkHome}
            >
              点击进入
            </Button>
          )}
      </View>
    )
  }
}
