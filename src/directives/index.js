// 负责管理所有的自定义指令
export const imagerror = {
    // 指令对象，会在当前的dom元素插入到节点之后执行
    // dom:表示当前指令作用的dom对象，dom此时认为就是图片
    // 当图片有地址，但是地址没有加载成功的时候，会报错，会触发图片的一个
    // 事件 => onerror

    // options:是指令中的变量的解释 ，其中有一个属性叫value
    inserted(dom, options) {
        dom.onerror = function () {
            // 当图片出现一场的时候，会将指令配置的默认图片设置为该图片的内容
            // dom可以注册error事件
            dom.src = options.value // 这个地方不能写死
        }
    }
}
