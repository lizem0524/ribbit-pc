import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Components from './components'
import Directives from './directives'
// 重置样式的库
import 'normalize.css'
// 公用样式
import '@/assets/styles/common.less'
// mock
import '@/mock'

createApp(App).use(store).use(router).use(Components).use(Directives).mount('#app')
