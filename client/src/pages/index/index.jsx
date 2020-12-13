import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import Login from '../../components/login/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() { }

  componentDidMount() {
    try {
      var userInfo = Taro.getStorageSync('userInfo')
      if (userInfo) {
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
    } catch (e) { }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='index'>
        <Login />
      </View>
    )
  }
}
