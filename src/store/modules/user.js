import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态,初始化vuex的时候，就先从缓存中读取
  userInfo: {} // 用户资料信息，定义空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken() {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)
    // result.data是因为axios默认加了一层data
    // if (result.data.success) {
    //   // 如果为true，表示登陆成功
    //   context.commit('setToken', result.data.data)
    // }
    // 因为响应拦截器中已经处理过数据了，所以这里直接这样写
    // 并且拦截器中已经设置如果返回失败，直接就返回Promise.reject了，所以这里不用再判断了
    context.commit('setToken', result)
    // 拿到token说明登陆成功
    setTimeStamp() // 设置当前的时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情,用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    // 通过延展运算符将两个数据对象合并
    const obj = { ...result, ...baseInfo }
    context.commit('setUserInfo', obj)
    // 这里return是为了后期做权限的时候埋下伏笔
    return result
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
