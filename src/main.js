import Vue from 'vue'

// 第三方css库，让不同的浏览器标签渲染效果一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化  语言切换
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 全局公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon  svg图标
import '@/permission' // permission control  权限控制

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI,{
  i18n:(key,value)=>i18n.t(key,value)
})

Vue.config.productionTip = false

// 批量导入自定义指令 作用可以简化指令的写法
// 可以把所有的按需导入的全部导入到一个对象中，对象名字叫directives
import * as obj from '@/directives'
// Object.keys(obj)
Object.keys(obj).forEach(item=>{
  Vue.directive(item,obj[item])
})

//什么时候用插件？ 我们封装一堆公共组件给同事使用的时候，为了使用方便
import components from './components'
// 自动执行install方法
Vue.use(components)

// 封装过滤器，修改时间
import * as filters from '@/filters'
Object.keys(filters).forEach(item=>{
  Vue.filter(item,filters[item])
})

// 打印的插件
import Print from 'vue-print-nb'
// Global instruction 
Vue.use(Print);

// 全局导入混入
import mixins from './mixins'
Vue.mixin(mixins)

// 语言国际化
import i18n from '@/lang'


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
