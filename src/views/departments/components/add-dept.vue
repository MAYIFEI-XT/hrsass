<template>
  <div>
    <!-- 放置弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancle">
      <!-- 表单数据 -->
      <!-- 表单组件el-form label-width设置label的宽度 -->
      <!-- 表单中的model:表单数据对象 -->
      <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option
              v-for="item in peoples"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <!-- 确定和取消  el-row支持flex布局-->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancle">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
    export default {
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
            treeNode: {
                type: Object,
                default: null
            }
        },
        data() {
            // 检查部门名称是否重复
            // 自定义校验规则的函数需要三个参数
            // 参数一rule:本条规则的对象数据
            // 参数二value:属性的值，该值是需要校验的值，此处为部门名称
            // 参数三callback:指向校验结束的回调函数，如果校验通过，调用callback()，如果未通过，一般使用下列形式：
            //              callback(new Error('具体的提示信息'));
            const checkNameRepeat = async(rule, value, callback) => {
                // 校验部门名称是否重复的时候需要先获取一下最新数据，因为有可能别人在此时新增了数据
                const { depts } = await getDepartments()
                let isRepeat = false
                if (this.formData.id) {
                    // 如果id存在，则是编辑模式
                    // 这里筛选的时候应该把自己排除掉
                    isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
                } else {
                    // 没有id就是新增
                    isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
                }
                // 去找同级部门下有没有和value相同的数据
                isRepeat ? callback(new Error(`同级部门下已经存在了这个${value}部门`)) : callback()
            }
            const checkCodeRepeat = async(rule, value, callback) => {
                const { depts } = await getDepartments()
                let isRepeat = false
                if (this.formData.id) {
                    // 如果id存在，则是编辑模式
                    isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
                } else {
                    // 没有id就是新增
                    isRepeat = depts.some(item => item.code === value && value)
                }
                // 要求编码和所有的部门编码都不能重复
                // 由于历史数据里有可能没有code，所以说这里要强制value不能为空

                isRepeat ? callback('该部门编码已经存在了') : callback()
            }
            return {
                // 定义表单数据
                formData: {
                    name: '',
                    code: '',
                    manager: '',
                    introduce: ''
                },
                // 校验规则(key:数组)
                rules: {
                    name: [
                        {
                            required: true,
                            message: '部门名称不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 50,
                            message: '部门名称长度为1-50'
                        },
                        {
                            trigger: 'blur',
                            validator: checkNameRepeat
                        }
                    ],
                    code: [
                        {
                            required: true,
                            message: '部门编码不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 50,
                            message: '部门编码长度为1-50'
                        },
                        {
                            trigger: 'blur',
                            validator: checkCodeRepeat
                        }
                    ],
                    manager: [
                        {
                            required: true,
                            message: '负责人不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 50,
                            message: '负责人长度为1-50'
                        }
                    ],
                    introduce: [
                        {
                            required: true,
                            message: '部门描述不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 300,
                            message: '部门描述长度为1-300'
                        }
                    ]
                },
                peoples: []
            }
        },
        computed: {
            showTitle() {
                return this.formData.id ? '编辑部门' : '新增部门'
            }
        },
        methods: {
            async getEmployeeSimple() {
                this.peoples = await getEmployeeSimple()
            },
            // 获取部门详情方法
            // 因为获取回来数据需要给弹层，所以在这里调用接口，而不是在父组件中调
            async getDepartDetail(id) {
                this.formData = await getDepartDetail(id)
                // 因为我们是父组件调用子组件的方法，是先设置了node数据，直接调用方法
                // 但是props数据传值是异步的，刚调用这个方法的时候，props的值可能还没传过来
                // 所以不能用treeNode中的数据，可以用方法传递进来一个id，避免异步
            },
            btnOK() {
                // 手动校验表单
                this.$refs.deptForm.validate(async isOK => {
                    if (isOK) {
                         // 校验通过
                        if (this.formData.id) {
                            // 如果id存在，说明是编辑状态
                            await updateDepartments(this.formData)
                        } else { // 否则就是新增
                            await addDepartments({ ...this.formData, pid: this.treeNode.id })
                        }

                        // 新增成功了，需要告诉父组件重新拉取数据
                        this.$emit('addDepts') // 触发自定义事件
                        // 修改showDialog值
                        // 可以使用vue提供的sync修饰符去修改,
                        // sync在父组件中传props属性的位置写
                        // update:props名称,值
                        this.$emit('update:showDialog', false)
                        // 关闭dialog的时候会自动触发el-dialog的close事件
                        // 所以这里不需要再单独的重置数据了
                    }
                })
            },
            btnCancle() {
                // 重置数据，因为resetFields只能重置表单上的数据
                // 非表单上的比如编辑中的id就不能重置
                this.formData = {
                    name: '',
                    code: '',
                    manager: '',
                    introduce: ''
                }
                // 关闭弹层
                this.$emit('update:showDialog', false)
                // 清除之前的校验信息,elementUI的表单提供的有方法清空
                // 这里是可以重置数据，但是只能重置定义在data中的数据
                this.$refs.deptForm.resetFields()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
