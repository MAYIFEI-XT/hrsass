// 权限拦截在路由跳转做 ，在导航守卫做
// 导航守卫是路由守卫，需要通过路由实例来监听
import router from '@/router'
import store from '@/store' // 引入store实例，和组件中的this.$store是一回事
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出，因为只需要在其他地方引入这个文件，执行代码即可

// router有两个方法，一个前置守卫，一个后置守卫
// 前置守卫,有一个参数是回调函数，这个回调函数有三个参数
// next是前置守卫必须执行的钩子，如果不执行next，页面就死了
// next() 放行
// next(false) 跳转终止
// next(地址) 跳转到某个地址
// 定义一个白名单
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
    // 导航守卫一开始的时候就应该开启进度条
    nProgress.start() // 开启进度条
    if (store.getters.token) {
        // 只有在有token的情况下，才能获取资料
        // 如果有token就判断一下是否是要去往登录页
        if (to.path === '/login') {
            // 如果是，就跳转到主页
            next('/')
        } else {
            // 只有在放行的时候才会去获取资料
            // 是每次都获取资料吗？
            // 如果当前的vuex中有用户的ID，表示已经有资料了，不用再获取了
            if (!store.state.user.userInfo.userId) {
                await store.dispatch('user/getUserInfo')
                console.log(store.state.user.userInfo)
                // 如果后续需要根据用户资料获取数据的话 ，那这里就必须改成同步
            }
            next()
        }
    } else {
        // 如果没有token，就判断一下是否是在白名单中
        if (whiteList.indexOf(to.path) > -1) {
            // 表示要去的地址在白名单中
            next()
        } else {
            next('/login')
        }
    }
    nProgress.done() // 解决手动切换地址时，进度条不关闭的情况
})
// 后置守卫
router.afterEach(() => {
    nProgress.done() // 关闭进度条
})
