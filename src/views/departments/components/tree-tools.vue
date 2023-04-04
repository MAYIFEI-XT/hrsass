<template>
  <el-row type="flex" justify="space-between" align="middle" style="width:100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <!-- 右侧内容 -->
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>操作<i class="el-icon-arrow-down" /></span>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
    export default {
        props: {
            // 定义传入的属性
            treeNode: {
                required: true,
                type: Object
            },
            isRoot: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            // 点击编辑/删除/新增时触发
            operateDepts(type) {
                if (type === 'add') {
                    // 添加子部门
                    // 添加子部门，是在当前部门下添加，所以需要当前部门的数据
                    this.$emit('addDepts', this.treeNode) // 触发自定义事件，告诉父组件要显示弹层
                } else if (type === 'edit') {
                    // 编辑部门
                    this.$emit('editDepts', this.treeNode)
                } else {
                    // 删除部门
                    this.$confirm('确定要删除该组织部门吗？').then(() => {
                        return delDepartments(this.treeNode.id)
                    }).then(() => {
                        // 调用接口删除了，后端的数据变化了，但是前端数据没变，需要重新拉取数据
                        // 这个组件只是个工具，需要通知父组件重新拉取数据
                        this.$emit('delDepts') // 触发自定义事件
                        this.$message.success('删除成功')
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
