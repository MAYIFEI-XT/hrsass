<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容  头部 -->
      <el-card class="tree-card">
        <!--放置结构内容 用了一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height:40px">
          <el-col>
            <!-- 左侧内容 -->
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <!-- 放置下拉菜单 -->
                <el-dropdown>
                  <span>操作<i class="el-icon-arrow-down" /></span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 下拉选项 -->
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 放置el-tree -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all="true">
          <!-- 传入内容，插槽内容，会循环多次，有多少个节点，就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据(el-tree循环节点的时候把数据传给插槽了)
                data就是每个节点的数据对象
          -->
          <el-row slot-scope="{ data }" type="flex" justify="space-between" align="middle" style="width:100%">
            <el-col>
              <!-- 左侧内容 -->
              <span>{{ data.name }}</span>
            </el-col>
            <el-col :span="4">
              <!-- 右侧内容 -->
              <el-row type="flex" justify="end">
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                  <!-- 放置下拉菜单 -->
                  <el-dropdown>
                    <span>操作<i class="el-icon-arrow-down" /></span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- 下拉选项 -->
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
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
      }
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
