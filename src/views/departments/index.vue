<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isLoading" style="min-height:700px" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading">
        <el-tabs>
            <el-tab-pane label="用户管理">
              <!-- 用了一个行列布局 -->
            <TreeItem :node="titleObj" @delDepartment="getDepartmentsList"></TreeItem>
            <el-tree :data="data" default-expand-all>
              <!-- 使用scope slot会传入两个参数node data -->
              <template v-slot="scope">
               <TreeItem :node="scope.node" @delDepartment="getDepartmentsList"></TreeItem>
              </template>
            </el-tree>
            </el-tab-pane>
         </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDepartmentsList} from '@/api/departments'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: {TreeItem},
  data () {
    return {
      data:[], 
      titleObj:{},
      deletedArr:[],
      isLoading:true,
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
   },
  methods: {
    async getDepartmentsList(){
       try{
        const res=await getDepartmentsList()
        // console.log(res);
        function tranferListToTree(list,pid){
          var list1=[]
          list.forEach(item=>{
            if(item.pid===pid){
              list1.push(item)
              item.children=tranferListToTree(list,item.id)
            }
          })
          return list1
        }
        const res1=tranferListToTree(res.depts,'')
        console.log(res1);
        this.data=res1
        this.titleObj=res.depts[0]
        this.isLoading=false
       }catch(err){
        console.log(err);
       }
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
