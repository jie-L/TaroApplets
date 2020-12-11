import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"

export default class Login extends Component {
  state = {
    userInfo: {},
    context: {}
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        console.log(res)
        this.setState({
          userInfo: res.result
        })
      })
  }

  login() {
    Taro.cloud
      .callFunction({
        name: 'login',
      })
      .then(res => {
        console.log('用户信息', res)
        this.setState({
          userInfo: res.result,
        })
      })
      .catch(console.log)
  }

  getUserInfo(e) {
    console.log(e)
    const { detail } = e
    if (detail.errMsg.endsWith('ok')) {
      const userInfo = JSON.parse(detail.rawData)
      const { nickName, gender, avatarUrl } = userInfo
      Taro.cloud
        .callFunction({
          name: 'postUserInfo',
          data: {
            name: nickName,
            gender: gender,
            avatarUrl: avatarUrl,
          },
        })
        .then(res => {
          this.setState({
            context: res.result,
          }, () => {
            console.log(this.state.context)
          })
          this.login()
        })
    }
  }

  render() {
    return (
      <View className='index'>
        {/* <Button onClick={this.getLogin}>获取登录云函数</Button> */}
        <Text>userInfo：{JSON.stringify(this.state.userInfo)}</Text>
        <Button
          openType='getUserInfo'
          onGetUserInfo={this.getUserInfo}
        >
          授权
        </Button>
      </View>
    )
  }
}
