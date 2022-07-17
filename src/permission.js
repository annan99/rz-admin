import router from '@/router'
import  NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList=['/login','/404']
// to去哪儿  from 来自哪儿   next 放行
// 前置路由守卫
router.beforeEach((to,from,next)=>{
      // 开启进度效果
      NProgress.start()
    // 权限控制
    const token=store.state.user.token
    if(token){
        // 如果登陆过就不能再登录，直接去后台首页
        if(to.path==='/login'){
            NProgress.done()
            next('/')
        }else{
           if(!store.state.user.userInfo.id){
            // 这块ajax只会发送一次,优化了一下
             // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
             store.dispatch('user/getInfo')
           }
            next()
        }
    }else{
       if(whiteList.includes(to.path)) {
        next()
       }else{
        next('/login')
       }
    }
  
})
// 后置路由守卫
router.afterEach(()=>{
    // 结束进度效果
    NProgress.done()
})