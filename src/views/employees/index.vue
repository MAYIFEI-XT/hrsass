<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" @click="exportData">excel导出</el-button>
          <el-button type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" border :data="list">
        <!-- 表格中通过type='index'来显示序号 -->
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" sortable="" />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template v-slot="obj">
            <!-- 使用过滤器将时间格式化 -->
            {{ obj.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template v-slot="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template v-slot="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height:60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev,pager,next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符 是 子组件去改变父组件的数据的一个语法糖 -->
    <AddEmployee :show-dialog.sync="showDialog" />
    <!-- 放置分配角色组件 -->
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from '@/views/employees/components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      showRoleDialog: false, // 显示分配角色弹层
      userId: null // 定义一个userId
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      console.log('开始加载')
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      console.log(rows)
      this.loading = false
    },
    // newPage是最新的页码
    changePage(newPage) {
      this.page.page = newPage // 重新赋值最新页码
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeesEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        this.$confirm('确定删除该员工吗？')
        // 点击了确定
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      // 通过懒加载的方式引入，用户只有点击按钮才会引入
      // .then认为加载成功
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        // 导出复杂表头信息
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // 需要合并单元格时的属性
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        console.log(data)
        // excel是引入文件的导出对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工数据表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    },
    // 将表头数据和数据对应
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 需要判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            return this.formatEmployment('', '', item[headers[key]])
          }
          return item[headers[key]]
        })
      })
      // 简化写法(因为还需要处理时间格式，所以这种写法不满足需求了)
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    async editRole(id) {
      this.userId = id
      // 通过ref拿到子组件的实例然后去调用子组件的方法
      // 因为这个方法是异步的，所以弹层显示的时候复选框还没有勾选，会闪一下才选上
      // 所以用await解决这个问题
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style></style>
