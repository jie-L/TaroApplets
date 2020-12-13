import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './Home.less'

export default class Home extends Component {
  state = {
    msg: 'Home',
    access_token: '',
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffff00',
      // animation: {
      //   duration: 400,
      //   timingFunc: 'easeIn'
      // }
    })

    Taro.showLoading({
      title: '加载中...',
    })

    Taro.cloud
      .callFunction({
        name: 'getToken',
        data: {
          type: 'get'
        },
      })
      .then(res => {
        console.log(res)
        var result = res.result
        if (result && result.code === 200) {
          this.setState({ access_token: result.access_token }, () => {
            this.getArtcleList()
          })
        } else if (result.code === 201) {
          Taro.hideLoading()
          Taro.showToast({
            title: '请联系管理员添加ip白名单！',
            icon: 'success',
            duration: 1000
          })
        } else {
          Taro.hideLoading()
          Taro.showToast({
            title: '服务器异常，请联系管理员！',
            icon: 'success',
            duration: 1000
          })
        }
      })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getArtcleList = () => {
    const { access_token } = this.state
    Taro.cloud
      .callFunction({
        name: 'articleList',
        data: {
          type: 'image',
          offset: 0,
          count: 10,
          access_token
        },
      })
      .then(res => {
        console.log(res)
        var result = res.result
        if (result && result.code === 200) {
          console.log(result)
          Taro.hideLoading()
        } else {
          Taro.hideLoading()
          Taro.showToast({
            title: '服务器异常，请联系管理员！',
            icon: 'success',
            duration: 1000
          })
        }
      })

  }

  config = {
    navigationBarTitleText: '首页'
  }

  render() {
    const { msg } = this.state
    return (
      <View className='Home'>
        {msg}
      </View>
    )
  }
}
