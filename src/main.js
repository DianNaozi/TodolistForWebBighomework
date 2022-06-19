import {createApp} from 'vue'
import App from './App.vue'
import '../public/globe.css'
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 配置axios请求库
axios.defaults.baseURL = 'http://godwei.asia:5915/' // 配置请求根路径

const app = createApp(App)
app.config.globalProperties.$http = axios// 把axios挂载到vue原型对象上通过vue直接调用

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).use(ElementPlus).mount('#app')
