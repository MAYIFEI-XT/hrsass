<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容  头部 -->
      <el-card class="tree-card">
        <!--放置结构内容 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容，插槽内容，会循环多次，有多少个节点，就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据(el-tree循环节点的时候把数据传给插槽了)
                data就是每个节点的数据对象
          -->
          <tree-tools slot-scope="{data}" :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      // 头部数据结构
      company: {
        name: '',
        manager: '',
        id: ''
      },
      departs: [{
        name: '总裁办',
        manager: '曹操',
        children: [{ name: '董事会', manager: '曹植' }]
      }, {
        name: '行政部', manager: '孙权'
      }, {
        name: '人事部', manager: '刘备'
      }],
      defaultProps: {
        label: 'name', // 表示从这个属性显示内容
        children: 'children' // 从这个属性去找子节点
      },
      // 控制弹出层的显示隐藏，默认不显示
      showDialog: false,
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments()// 调用自身的方法
  },
  methods: {
    // 为什么不再钩子函数直接调用接口方法？因为获取数据的方法可能会被频繁调用，所以封装成方法
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转换为树形结构
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    // 参数node是传过来的点击的当前的部门数据
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
      // 在这里调用子组件获取部门详情接口的方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
