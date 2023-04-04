// 负责所有全局自定义组件的注册

// 使用vue.use()的时候，会调用里面的install()方法，并且传进去一个vue实例
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
    install(Vue) {
        // 组件的注册
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
    }
}
