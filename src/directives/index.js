
// 自定义指令  想封装dom操作的时候，共页面上一堆组件使用
export const imgerror={
  inserted(el,binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
  