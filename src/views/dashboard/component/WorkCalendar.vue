<template>
<div>
    <el-row type="flex" justify="end" :gutter="10">
      <el-col :span="6">
        <el-select size="mini" style="width:100%" v-model="year" @change="handleChange">
          <el-option v-for="(item,index) in 11" :key="index"
          :value="year - 6 + item">{{year - 6 + item}}</el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select size="mini" style="width:100%" v-model="month" @change="handleChange">
          <el-option v-for="(item,index) in 12" :key="index" :value="item">{{item}}</el-option>
          <!-- <el-option>1</el-option>
          <el-option>2</el-option>
          <el-option>3</el-option>
          <el-option>4</el-option>
          <el-option>5</el-option>
          <el-option>6</el-option>
          <el-option>7</el-option>
          <el-option>8</el-option>
          <el-option>9</el-option>
          <el-option>10</el-option>
          <el-option>11</el-option>
          <el-option>12</el-option> -->
        </el-select>
      </el-col>
      
    </el-row>
    <el-calendar v-model="value" ref="calendar">
      <template #dateCell="scope">
        <span>{{scope.date.getDate()}}</span>
        <div v-if="scope.date.getDay()===0 || scope.date.getDay()===6" class="rest">休</div>
      </template>
      </el-calendar>
</div>
</template>

<script>
export default {
  created () {},
  data () {
    return {
      month:(new Date()).getMonth()+1,
      year:(new Date()).getFullYear(),
      value: new Date()
    }
  },
  // 第一种
  mounted(){
    // 每个组件身上都有一个$el属性，对应的是渲染成真正DOM之后最外层的div盒子
    // 不操作DOM功能肯定做不出来
    var that=this    //把外面的this对应的对象存储起来
    this.$refs.calendar.$el.addEventListener('click',function(){
      // 这里不能用this，因为this指向的是DOM元素，而不是当前组件实例对象那个
      // realSelectedDay  用户选择哪儿一天
      that.month=new Date(that.$refs.calendar.realSelectedDay).getMonth()+1
    })
  },
  // 第二种
//    watch: {
//     value: {
//       handler(newVal, oldVal) {
//         this.month = newVal.getMonth() + 1
//         this.year = newVal.getFullYear()
//       },
//       deep: true
//     }
//   },
  methods: {
    handleChange(){
      var str=this.year + '-' + this.month
      console.log(str);
      this.value=new Date(str)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang="scss">
::v-deep .el-calendar__header {
  display: none;
}
::v-deep .el-calendar__body {
  padding: 0;
}
::v-deep .el-calendar-table td {
  border: none;
  text-align: center;
}
::v-deep .el-calendar-table tr td:first-child {
  border: none;
}
::v-deep .el-calendar-table tr:first-child td {
  border: none;
}
.rest{
  border-radius: 50%;
  background-color: orange;
  color: #fff;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  display: inline-block;
}
</style>
