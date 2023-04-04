import request from '@/utils/request'
/**
 * 获取员工的简单列表
 * @returns
 */
export function getEmployeeSimple() {
    return request({
        url: '/sys/user/simple'
    })
}
/**
 * 获取员工综合列表
 */
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}
/**
 * 删除员工接口
 */
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}
/**
 * 新增员工的接口
 */
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'POST',
        data
    })
}
/**
 * 批量导入员工
 * 参数data是一个数组类型
 */
export function importEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'POST',
        data
    })
}
/**
 * 给用户分配角色
 */
export function assignRoles(data) {
    return request({
        url: '/sys/user/assignRoles',
        method: 'PUT',
        data
    })
}
