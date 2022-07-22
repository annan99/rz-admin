<template>
 <div style="width:100%">
  <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; padding: 30px 140px; font-size: 14px;width:100%"
            >
              <el-col>
                <span>{{node.data ? node.data.name : node.name}}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{node.data ? node.data.manager : '负责人'}}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="onCommand">
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                        <template v-if="node.data">
                          <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                          <el-dropdown-item command="c">删除部门</el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-dialog :title="title" :visible.sync="addDialogVisible" width="50%" @click.native.stop @close="handleAddClose">
          <el-form label-width="100px" :model="addDepartmentForm" :rules="rules" ref="addFormRef">
            <el-form-item label="部门名称" prop="name">
              <el-input placeholder="1-50个字符" v-model="addDepartmentForm.name">
              </el-input>
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
              <el-input placeholder="1-50个字符" v-model="addDepartmentForm.code">
              </el-input>
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
              <!-- <el-input placeholder="请选择负责人" v-model="addDepartmentForm.manager"> -->
                <el-select v-model="addDepartmentForm.manager" placeholder="请选择" filterable>
                  <el-option :label="item.username" :value="item.username"  v-for="item in users" :key="item.id"></el-option>
                  <!-- <el-option label="李四" value="002"></el-option> -->
                </el-select>
              <!-- </el-input> -->
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
              <el-input type="textarea" placeholder="1-300个字符" v-model="addDepartmentForm.introduce">
              </el-input>
            </el-form-item>
          </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script>
import {getSimpleUserList} from '@/api/user'
import {delDepartment,addDepartment,getDepartmentsList,editDepartment} from '@/api/departments'
export default {
  props:{
    node:{
      type:Object,
      required:true,
    }
  },
  created () {},
  data () {
    // element ui 自定义校验规则函数
    // rule 代表当前校验规则
    // value 要校验的数据
    const validateName=async (rule,value,callback)=>{
      // 拿到所有的部门数据
      const res=await getDepartmentsList()
      if(this.isEdit) {
        // 标题不存在编辑
        const pid=this.node.data.pid  //把当前要编辑的部门父级的id找到，然后根据这个pid去找所有的兄弟元素
        res.depts.filter(item=>item.pid===pid && item.id !==this.node.data.id).some(item=>item.name===value) ? callback(newError('部门名称重复')) : callback()
      }else{
          // 待筛选的所有子部门的pid
      const id=this.node.data ? this.node.data.id : ''
      // filter筛选  只要有子部门pid和当前部门id一样  说明就是他的子部门
      // some 看有没有符合条件
      res.depts.filter(item=>item.pid===id).some(item=>item.name===value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      addDialogVisible:false,
      addDepartmentForm:{
        name:'',   //部门名称
        code:'',   //部门编码
        manager:'', //部门负责人
        introduce:'' //部门介绍
      },
      rules:{
        name:[
          {required:true,message:'部门名称不能为空',trigger:'blur'},
          {min:3,max:10,message:'长度在3-10之间',trigger:'blur'},
          {validator:validateName,trigger:'change'}
        ],
        code:[
           {required:true,message:'部门编码不能为空',trigger:'blur'},
          {min:3,max:10,message:'长度在3-10之间',trigger:'blur'}
        ],
        manager:[
           {required:true,message:'部门负责人不能为空',trigger:'blur'},
          {min:3,max:10,message:'长度在3-10之间',trigger:'blur'}
        ],
        introduce:[
           {required:true,message:'部门介绍不能为空',trigger:'blur'},
          {min:3,max:100,message:'长度在3-100之间',trigger:'blur'}
        ]
      },
      users:[], //简单用户列表
      isEdit:false, //用来判断当前是在做添加还是编辑
    }
  },
  methods: {
    async onCommand(key){
      if(this.users.length===0){

        this.getSimpleUserList()
      }
      // console.log(key);
      if(key==='a'){
        this.isEdit=false
        this.addDialogVisible=true
      }else if(key==='b'){
        this.isEdit=true
        this.addDialogVisible=true
        console.log('编辑')
        // 浅拷贝 拷贝一层
        this.addDepartmentForm={...this.node.data}
      }else{
       try{
        await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log('用户确定了');
        await delDepartment(this.node.data.id)
        this.$emit('delDepartment')
       }catch(err){
         this.$message({
            type: 'info',
            message: '已取消删除'
          });    
       }
      }
    },
    async getSimpleUserList(){
      const res=await getSimpleUserList()
      // console.log(res);
      this.users=res
    },
    handleAddClose(){
       this.$refs.addFormRef.resetFields()   //表单重置
    },
    async onSubmit(){
      if(this.isEdit){
        delete this.addDepartmentForm.children  //把对象的children属性移除
        await editDepartment(this.addDepartmentForm)
      }else{
        this.addDepartmentForm.pid=this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
        this.addDialogVisible=false
        this.$emit('delDepartment')  //子向父传值。实时更新数据
    }
  },
  computed: {
    title(){
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>

</style>
