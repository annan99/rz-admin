<template>
<div class="app-container">
  <el-card>
    <el-tabs v-model="activeName">
    <el-tab-pane label="登录账户设置" name="first">
       <el-form label-width="50px" style="width:400px;margin-left:200px;margin-top:50px"
       :model="userInfo" :rules="userInfoRules" ref="userInfoRef">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">更新</el-button>
          <el-button>取消</el-button>
        </el-form-item>
       </el-form>
    </el-tab-pane>
    <el-tab-pane label="个人详情" name="second">
      <UserInfo :id="id"></UserInfo>
    </el-tab-pane>
    <el-tab-pane label="岗位信息" name="third">
      <JobInfo></JobInfo>
    </el-tab-pane>
  </el-tabs>  
  </el-card>  
</div>
</template>

<script>
import JobInfo from './components/JobInfo.vue'
import UserInfo from './components/UserInfo.vue'
import {saveEmployee} from '@/api/employee'
import {getUserDetailById} from '@/api/user'
export default {
  props:{
    id:{
      type:[Number,String],
      required:true,
    }
  },
  created () {
    this.getUserDetailById()
  },
  data () {
    return {
      activeName:'first',
      userInfo:{
        username:'',
        password:''
      },
      userInfoRules:{
        username:[
          {required:true,message:'用户名不能为空',trigger:'blur'}
        ],
        password:[
          {required:true,message:'密码不能为空',trigger:'blur'}
        ]
      }
    }
  },
  methods: {
    async getUserDetailById(){
      const res=await getUserDetailById(this.id)
      // console.log(res);
      // this.userInfo.username=res.username
      this.userInfo=res
      res.password=null
    },
    save(){
      this.$refs.userInfoRef.validate(async valid=>{
        if(!valid) return this.$message.error('表单数据校验失败')
        await saveEmployee(this.id,this.userInfo)
        this.$message.success('更新成功')
      })
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {UserInfo,JobInfo}
}
</script>

<style scoped lang="scss">

</style>
