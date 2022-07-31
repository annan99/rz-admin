import PageTool from './PageTool'
import UploadImage from './UploadImage'
export default {
    // install 安装
    install (Vue) {
        Vue.component('PageTool',PageTool)
        Vue.component('UploadImage',UploadImage)
    }
}