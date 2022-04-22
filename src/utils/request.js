import axios from 'axios'
import store from '@/store/'
import router from '@/router/'
// 其他方式的请求会用到
// export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 5000
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    const { token } = store.state.user.profile
    // 如果有token，注入token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    // 401状态码，token失效
    if (err.response && err.response.status === 401) {
      // 清空用户信息
      store.commit('user/setUser', {})
      // 携带当前路由信息跳登录页
      // 在组件中:$route.fullPath  js模块中：router.currentRoute.value.fullPath
      // 转换Url编码，因为解析是以&分隔，特殊字符会出问题。
      // 1.拿跳转前的完整路径
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      // 2. 拿完整路径去登录页
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
