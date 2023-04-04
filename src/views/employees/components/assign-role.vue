<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <!-- 多选框组 -->
      <el-checkbox-group v-model="roleIds">
        <!-- 要循环的选项 -->
        <!-- 要显示角色名称，存储角色id -->
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 定义footer的插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
    export default {
        props: {
            showRoleDialog: {
                type: Boolean,
                default: false
            },
            userId: {
                // 用户的id，需要知道当前处理的是哪个用户
                type: String,
                default: '',
                required: true // 要求必须传
            }
        },
        data() {
            return {
                list: [], // 负责存储当前所有的角色id
                roleIds: [] // 负责存储当前用户所拥有的角色id
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            async getRoleList() {
                // 默认是只取10条数据
                const { rows } = await getRoleList({ page: 1, pagesize: 20 })
                // rows是要循环的记录
                this.list = rows
            },
            // 因为props传值是异步的，有可能执行这个方法的时候，props还没有传值进来，所以这里不能使用this.userId直接给接口
            // 这个方法是给父组件调用的
            async getUserDetailById(id) {
                const { roleIds } = await getUserDetailById(id)
                // 将查询到的角色所拥有的角色赋值给当前用户的对象
                this.roleIds = roleIds
            },
            async btnOK() {
                console.log(this.userId)
                console.log(this.roleIds)
                await assignRoles({ id: this.userId, roleIds: this.roleIds })
                // 关闭弹层
                this.$emit('update:showRoleDialog', false)
            },
            btnCancel() {
                // 关闭弹层
                this.roleIds = [] // 重置数据，还原成一个空数组
                this.$emit('update:showRoleDialog', false)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
