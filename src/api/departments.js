import request from '@/utils/request'
/**
 * 获取组织架构列表
 */
export function getDepartments() {
    return request({
        url: '/company/department'
    })
}
/**
 * 删除组织结构的部门
 */
export function delDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        Method: 'delete' // 接口满足restful接口规范
        // 同样的地址，不同的方法，执行不同的业务
        // delete 删除业务
        // get    获取业务
        // post   新增或者添加业务
        // put    修改业务
    })
}
/**
 * 新增部门
 */
export function addDepartments(data) {
    return request({
        url: '/company/department',
        method: 'POST',
        data: data // axios的body参数
    })
}
/**
 * 获取某个部门详情
 */
export function getDepartDetail(id) {
    return request({
        url: `/company/department/${id}`
    })
}

/**
 * 保存编辑的数据
 */
export function updateDepartments(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'PUT',
        data
    })
}
