<template>
<div>
    <el-upload
  action="#"
  list-type="picture-card"
  accept="image/png,image/jpg,image/jpeg,image/gif"
  :limit="limit" :class="{hidden:filesList.length===limit}"
  :on-change="handleChange" :file-list="filesList" :http-request="handleRequest">
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>
<el-progress :percentage="percent"></el-progress>
<el-dialog :visible.sync="dialogVisible" title="预览">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
</div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
    SecretId: 'AKIDOlsNh7JFtHwKSJupWw63lCMEqCG3aswm',
    SecretKey: 'dzNXP0NXR5RYtb3E8k46h4B1asviDQN3',
});
export default {
    props:{
        limit:{
            type:Number,
            default:1
        }
    },
  created () {},
  data () {
    return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        filesList:[],
        percent:0,  //进度条
    }
  },
  methods: {
    // 删除照片
     handleRemove(file) {
        // console.log(file);
        this.filesList=this.filesList.filter(item=>item.uid!==file.uid)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      handleChange(file,fileList){
        console.log(fileList);
        this.filesList=fileList
       
      },
    //   用腾讯云上传
      handleRequest(obj){
        var that=this   //把外面的this赋值给that
        console.log(obj);
         cos.putObject({
    Bucket: 'image-1313062426', /* 必须 存储桶名字*/
    Region: 'ap-shanghai',     /* 存储桶所在地域，必须字段 */
    Key: Date.now()+obj.file.name,              /* 必须  随便写*/
    StorageClass: 'STANDARD',
    Body: obj.file, // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        that.percent=Math.ceil(progressData.loaded / progressData.total * 100)
    }
},(err, data)=> {
    console.log(err || data);
    this.src=data.Location
});
      },
      
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
