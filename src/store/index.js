import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// 3个模块
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // 持久化
  plugins: [createPersistedState({
    key: 'erabbit-client-pc-store',
    paths: ['user', 'cart']
  })]
})
