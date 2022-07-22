<template>
<div>
    <el-button type="primary" size="mini" @click="roleDialogVisible=true;isEdit=false;form={};">新增角色</el-button>
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="name" label="角色名" sortable width="160px"></el-table-column>
      <el-table-column prop="description" label="描述" sortable></el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="scope">
            <el-button type="text" @click="showRightDialog(scope.row.id)">分配权限</el-button>
            <el-button type="text" @click="showRoleDialog(scope.row)">修改</el-button>
            <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-row type="flex" justify="end">
        <el-pagination
      :current-page="paramsObj.page"
      :page-size="paramsObj.pagesize"
      :page-sizes="[2,3,4,5,6]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>
     </el-row>
     <!-- 分配权限 -->
     <el-dialog title="分配权限" :visible.sync="rightVisible" width="30%">
        <!-- v-if作用：保证每次对话框关闭的时候，让tree销毁，在显示的时候看到的是一个新的tree -->
        <el-tree v-if="rightVisible" :data="permissions" ref="myTree" :props="{label:'name'}" default-expand-all show-checkbox node-key="id" :default-checked-keys="selectedPermissions"></el-tree>
        <template #footer>
            <el-button type="primary" @click="save">确认</el-button>
            <el-button @click="rightVisible=false">取消</el-button>
        </template>
     </el-dialog>
     <!-- 新增和编辑 -->
     <el-dialog :title="isEdit ? '修改' : '新增'" :visible.sync="roleDialogVisible" @close="reset">
        <el-form label-width="80px" :model="form" :rules="rules" ref="myForm">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name">
                </el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
                <el-input v-model="form.description">
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onClick">确认</el-button>
            <el-button @click="roleDialogVisible=false">取消</el-button>
        </template>
     </el-dialog>
</div>
</template>

<script>
import {getRoleList,delRole,addRole,editRole} from '@/api/setting'
import {assignPermission, getPermissions,getPermissionsById} from '@/api/permission'
import {tranferListToTree} from '@/utils'
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
        paramsObj:{
            page:1,  //默认拿第一页数据
            pagesize:4,  //每页数量
        },
        roleList:[],
        total:null,
        rightVisible:false,
        permissions:[],
        selectedPermissions:[],
        id:null,
        roleDialogVisible:false,
        form:{
            name:'',
            description:'',
        },
        rules:{
            name:[
                {required:true,message:'角色名称不能为空',trigger:'blur'}
            ]
        },
        isEdit:false,
    }
  },
  methods: {
    async getRoleList(){
        const res=await getRoleList(this.paramsObj)
        // console.log(res);
        this.roleList=res.rows
        this.total=res.total  //用作分页
    },
    handleCurrentChange(page){
        this.paramsObj.page=page
        this.getRoleList()
    },
    handleSizeChange(pagesize){
        this.paramsObj.pagesize=pagesize
        this.getRoleList()
    },
    del(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            await delRole(id)
            // 删除当前这一夜到前一页
            if(this.roleList.length===1 && this.paramsObj.page>1){
                this.paramsObj.page--
            }
            this.getRoleList(),
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async showRightDialog(id){
        this.id=id
        // 获取所有权限点
        const res=await getPermissions()
        console.log(res);
        this.permissions=tranferListToTree(res,'0')
        // 获取当前权限点
        const res1=await getPermissionsById(id)
        console.log(res1);
        this.selectedPermissions=res1.permIds
        this.rightVisible=true
    },
    async save(){
        // console.log(this.$refs.myTree.getCheckedKeys());
        await assignPermission(this.id,this.$refs.myTree.getCheckedKeys())
        this.rightVisible=false
    },
    onClick(){
        // 二次校验
        this.$refs.myForm.validate(async bool=>{
            if(!bool) return this.$message.error('表单数据非法')
            // console.log('发送ajax');
            if(this.isEdit){
              await editRole(this.form)
            }else{
              await addRole(this.form)
            }
            this.getRoleList()
            this.roleDialogVisible=false
            this.form=''
        })
    },
    reset(){
        this.$refs.myForm.resetFields()
    },
    showRoleDialog(row){
      this.isEdit=true
      this.roleDialogVisible=true
      this.form={...row}  //浅拷贝 二选一
      // this.form=Object.assign({},row)   // 浅拷贝
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang="scss">
.el-table{
    margin-top: 20px;
    margin-bottom:20px
}
</style>
