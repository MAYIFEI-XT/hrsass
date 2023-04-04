// 员工的路由规则
import layout from '@/layout'
export default {
    // 路由规则
    path: '/attendances', // 路由地址
    // 给模块的一级路由加一个name属性，这个属性在后面做权限的时候用到
    name: 'attendances',
    // 当路径匹配到时，不仅要显示一级路由layout，还要显示二级路由的组件
    component: layout,
    children: [{
        // 二级路由的path什么都不用写的时候，此时它表示的是二级路由的默认路由
        path: '', // 这里不用写，什么都不写表示/employees ,不但有布局layout，还有员工主页
        component: () => import('@/views/attendances'),
        // 路由元信息，其实就是一个存储数据的地方，可以放任何的内容
        meta: {
            // 这个地方为什么要用title，因为左侧导航读取了这里的title属性
            title: '考勤',
            icon: 'skill'
        }
    }]
}
