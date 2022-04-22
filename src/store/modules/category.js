// 常量数据，防止进入页面白屏
import { topCategory } from '@/api/constants'
import { getAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // map常量数据，返回一个函name属性对象的数组(与后端数据对应)
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setCategory (state, payload) {
      state.list = payload
    },
    // 控制当前分类下的二级分类的显示和隐藏
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  actions: {
    // 获取分类数据 在布局组件中调用
    async getCategory ({ commit }) {
      const data = await getAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的flag
      data.result.forEach(item => { item.open = false })
      commit('setCategory', data.result)
      // console.log(data.result)
    }
  }

}
