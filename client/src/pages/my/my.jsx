import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './my.less'

export default class My extends Component {
  state = {
    msg: 'My',
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#8400ff',
      // animation: {
      //   duration: 400,
      //   timingFunc: 'easeIn'
      // }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loginOut = () => {
    try {
      Taro.removeStorageSync('userInfo')
      Taro.reLaunch({
        url: '../../pages/index/index'
      })
    } catch (e) {
      // Do something when catch error
    }
  }

  config = {
    navigationBarTitleText: '我的'
  }

  render() {
    const { msg } = this.state
    return (
      <View className='My'>
        {msg}
        <Button onClick={this.loginOut}>退出</Button>
      </View>
    )
  }
}
