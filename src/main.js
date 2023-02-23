import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// * as 变量 表示将目标文件中的所有导出的变量全部引入过来
import * as directives from '@/directives'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// es6中对象的keys方法可以返回一个表示给定对象的所有可枚举属性的字符串数组
// 这样处理就可以循环遍历目标文件，把全部自定义指令全部注册
Object.keys(directives).forEach(key => {
  // Vue.directive注册自定义指令
  // 参数一：自定义指令的名称
  // 参数二：自定义指令的钩子函数对象
  Vue.directive(key, directives[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
