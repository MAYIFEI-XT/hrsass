import request from '@/utils/request'

/**
 * 获取角色列表
 */
export function getRoleList(params) {
    return request({
        url: '/sys/role',
        params
    })
}
/**
 * 根据id查询企业
 */
export function getCompanyInfo(companyId) {
    return request({
        url: `/company/${companyId}`
    })
}
/**
 * 删除角色
 */
export function deleteRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'DELETE'
    })
}
/**
 * 读取角色详情
 */
export function getRoleDetail(id) {
    return request({
        url: `/sys/role/${id}`
    })
}
/**
 * 修改角色详情
 */
export function updateRoleDetail(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'PUT',
        data
    })
}
/**
 * 新增角色
 */
export function addRole(data) {
    return request({
        url: '/sys/role',
        method: 'POST',
        data
    })
}

