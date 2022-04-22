export default {
  namespaced: true,
  state () {
    return {
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登录后回跳地址
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改登录后回跳地址
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  },
  actions: {
    setUser2 ({ commit }, payload) {
      commit('setUser', payload)
    }
  }
}
