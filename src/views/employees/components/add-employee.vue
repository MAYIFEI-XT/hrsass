<template>
  <div>
    <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="username" label="姓名">
          <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="timeOfEntry" label="入职时间">
          <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
        </el-form-item>
        <el-form-item prop="formOfEmployment" label="聘用形式">
          <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择聘用形式">
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="workNumber" label="工号">
          <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item prop="departmentName" label="部门">
          <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
          <!-- 放置一个树形组件 -->
          <el-tree v-if="showTree" v-loading="loading" :default-expand-all="true" :data="treeData" :props="{label:'name'}" @node-click="selectNode" />
        </el-form-item>
        <el-form-item prop="correctionTime" label="转正时间">
          <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <el-row slot="footer" type="flex" justify="center" align="middle">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
    export default {
        props: {
            showDialog: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                EmployeeEnum,
                // 定义表单数据
                formData: {
                    username: '',
                    mobile: '',
                    formOfEmployment: '',
                    workNumber: '',
                    departmentName: '',
                    timeOfEntry: '',
                    correctionTime: ''
                },
                rules: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        { min: 1, max: 4, message: '用户名为1-4位', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                        // pattern 是正则表达式的意思，如果满足就通过校验，不满足就不通过
                        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                    ],
                    formOfEmployment: [
                        { required: true, message: '聘用形式不能为空', trigger: 'blur' }
                    ],
                    workNumber: [
                        { required: true, message: '工号不能为空', trigger: 'blur' }
                    ],
                    departmentName: [
                        { required: true, message: '部门不能为空', trigger: 'change' }
                    ],
                    timeOfEntry: [
                        { required: true, message: '入职时间不能为空', trigger: 'blur' }
                    ]
                },
                treeData: [], // 定义一个数组来接收树形结构
                showTree: false, // 默认不显示树形结构
                loading: false // 加一个进度条就可以解决展开部门的时候出现的卡顿情况
            }
        },
        methods: {
            async getDepartments() {
                this.showTree = true
                this.loading = true
                const { depts } = await getDepartments()
                // depts是一个数组，需要转化成树形结构,才可以被el-tree显示
                this.treeData = tranListToTreeData(depts, '')
                this.loading = false
            },
            // 这里要第一个参数就够了
            selectNode(node) {
                this.formData.departmentName = node.name
                this.showTree = false
            },
            btnCancel() {
                this.formData = {
                    username: '',
                    mobile: '',
                    formOfEmployment: '',
                    workNumber: '',
                    departmentName: '',
                    timeOfEntry: '',
                    correctionTime: ''
                }
                this.$refs.addEmployee.resetFields() // 移除校验规则
                // update:props名称 这样写的话可以在父组件中直接用sync修饰符处理
                this.$emit('update:showDialog', false)
            },
            async btnOK() {
                // 校验表单
                try {
                    await this.$refs.addEmployee.validate()
                    // 校验通过之后才会执行下面的代码
                    await addEmployee(this.formData) // 调用新增员工的接口
                    // 通知父组件更新页面数据
                    // this.$parent 父组件的实例
                    this.$parent.getEmployeeList() // 直接调用父组件的更新方法
                    this.$parent.showDialog = false
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
