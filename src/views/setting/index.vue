<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 给表格绑定数据 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <!-- 用el-row是因为想用它的flex布局 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total" layout="prev,pager,next" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert :closable="false" :show-icon="true" title="对公司名称、公司地址、营业执照、公司地区的更新、将使得公司资料被重新审核，请谨慎修改" />
            <!-- 并不是所有的表单都需要model,rules,需要做表单校验的时候需要这些 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" style="width:400px" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <!-- close事件在点击确定的时候也会触发 -->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置slot插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRoleDetail, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接角色数据
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 控制弹层的显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取企业信息
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async deleteRole(id) {
      // 提示
      // 成功进.then(),失败进.catch(),使用了await需要捕获catch()
      try {
        await this.$confirm('确定要删除该角色吗')
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据回写
      this.showDialog = true
    },
    btnCancel() {
      this.formData = {
        name: '',
        description: ''
      }
      // 清除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      // 对整个表单进行校验的方法，参数为一个回调函数。
      // 该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
      // 若不传入回调函数，则会返回一个 promise
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过才会执行下面的代码
        // roleForm这个对象有id就是编辑，没有id就是新增
        if (this.roleForm.id) {
          await updateRoleDetail(this.roleForm)
        } else {
          // 新增
          await addRole(this.formData)
        }
        await updateRoleDetail(this.roleForm)
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('修改成功')
        this.showDialog = false // 关闭弹层，会触发el-dialog的close事件
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
