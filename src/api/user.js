import request from '@/utils/request'

/**
 *登陆接口封装
 */
export function login(data) {
    // 返回一个promise对象
    return request({
        url: '/sys/login',
        method: 'POST',
        data
    })
}
/**
 * 获取用户资料接口封装
 */
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'POST'
    })
}
/**
 * 根据用户id获取用户详情
 */
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

export function logout() {

}
