import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 设置超时时间(1小时)
const service = axios.create({
    // 当执行npm run dev => .env.development => /api 就可以触发代理机制
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 // 超时时间
})

// 请求拦截器
// 主要用于处理token的统一注入问题
// 请求拦截器，有两个参数，一个是执行成功，一个是执行失败，是两个回调函数
service.interceptors.request.use(config => {
    // config 是请求的配置信息，这个config无论什么时候都需要return回去，如果不return，会认为没有config
    // 注入token
    if (store.getters.token) {
        // 只有在有token的情况下，才有必要检查时间戳是否过期
        if (CheckTimeOut()) { // 如果是true，表示过期了
            // token超时了，没用了，直接调用登出操作的action就行
            store.dispatch('user/logout')
            // 跳到登陆页
            router.push('/login')
            return Promise.reject(new Error('token超时了'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器，有两个参数，一个是执行成功，一个是执行失败，是两个回调函数
// 主要处理返回的数据异常和数据结构问题
// 如果执行成功了，response就是响应回来的数据
service.interceptors.response.use(response => {
    // axios默认加了一层data
    // 把需要的数据字段解构出来
    const { success, message, data } = response.data
    // 根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        // 此时认为业务已经错误了，不能进then了，应该进catch
        Message.error(message)
        // 此时没有错误对象，就new一个
        return Promise.reject(new Error(message))
    }
}, error => {
    // error信息里面会有response对象
    // 可以判断这个response对象的code是否和超时状态码一样
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 如果等于10002的时候，表示后端告诉我token超时了
        store.dispatch('user/logout')
        router.push('/login')
    } else {
        Message.error(error.Message) // 提示错误信息
    }
    // promise对象里有个静态方法reject,参数是错误对象error
    return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
})
// 用于检查是否超时
// 判断超时逻辑，(当前时间-缓存中的事件) 是否大于时间差
function CheckTimeOut() {
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
