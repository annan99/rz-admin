import axios from 'axios'
import { Message } from 'element-ui';
import {getTime} from '@/utils/auth'
import router from '@/router'
// vuex和本地存储
// 1.vuex数据是响应式的，实时更新的。而本地存储需要用户手动更新
// 2.vuex速度更快，因为vuex数据在内存中，本地存储在文件中，获取时间慢
import store from '@/store'
const request=axios.create({
  baseURL:process.env.VUE_APP_BASE_API,
  timeout:10000
})


// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token=store.state.user.token
  if(token){
    const time=Date.now() - getTime()
    if(time>7200000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization']='Bearer ' + token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  const {data,success,message}=response.data
  if(success){
    return data
  }else{
    Message.error(message)
    return Promise.reject(new Error(message))
  }
  // 对响应数据做点什么
  // return response;
}, function (error) {
  console.dir(error)
  if(error.response && error.response.data && error.response.data.code===10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default request