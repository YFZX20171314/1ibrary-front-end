import React, { Component } from 'react'
import {
  View
} from 'react-native'
import RNSplashScreen from 'react-native-splash-screen'
import { Actions } from 'react-native-router-flux'
import { SCENE_INDEX, SCENE_LOGIN } from './constants/scene'
import Storage from './common/storage'
import { setApiBaseUrl } from './network/HttpUtils'
import schools from './network/schools'
import login from './network/login'
import Toast from 'antd-mobile/lib/toast'

class SplashScreen extends Component {

  async componentWillMount () {

    const user = await Storage.get('user', {})
    if (!user.account || !user.password) {
      Actions[SCENE_LOGIN]()
      RNSplashScreen.hide()
      return
    }

    setApiBaseUrl(schools[user.school_id].host)

    try {
      const response = await login(user.account, user.password, user.school_id)
      Actions[SCENE_INDEX]({ user: response.data })
    } catch (e) {
      console.log(e)
      Toast.fail('自动登录失败', 3)
      Actions[SCENE_LOGIN]()
    }

    RNSplashScreen.hide()
  }

  render () {
    return <View />
  }
}

export default SplashScreen

console.disableYellowBox = true

/**
 * RN-BUGS
 * 在Debug环境下console.dir有效，
 * 生产环境下console.dir为undefined。所以需要打个补丁
 * 以下补丁同理
 */
if (!(console.dir instanceof Function)) {
  console.dir = console.log
}

if (!(console.time instanceof Function)) {
  console.time = console.log
}

if (!(console.timeEnd instanceof Function)) {
  console.timeEnd = console.log
}
