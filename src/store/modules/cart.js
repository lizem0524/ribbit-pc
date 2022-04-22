import { getNewCartGoods, mergeCart, getCart, addCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      //   id: id,
      //   name,
      //   price,
      //   nowPrice: price,
      //   skuId,
      //   stock,
      //   attrsText,
      //   picture: mainPictures[0],
      //   count: count.value,
      //   selected: true,
      //   isEffective: true
      list: []
    }
  },
  getters: {
    validList: state => state.list.filter(item => item.stock > 0 && item.isEffective), // 有库存且有效的购物车列表
    validTotal: (state, getters) => getters.validList.reduce((p, c) => p + c.count, 0), // 有库存且有效的商品总数量
    validAmount: (state, getters) => getters.validList.reduce((p, c) => p + c.count * c.nowPrice, 0).toFixed(2), // 有库存且有效的商品总金额
    selectedList: (state, getters) => getters.validList.filter(item => item.selected), // 选中的有效商品
    selectedTotal: (state, getters) => getters.selectedList.reduce((p, c) => p + c.count, 0), // 选中的总数量
    selectedAmount: (state, getters) => getters.selectedList.reduce((p, c) => p + c.count * c.nowPrice, 0).toFixed(2), // 选中的总金额
    isCheckAll: (state, getters) => getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length, // 是否全选
    invalidList: state => state.list.filter(item => item.stock <= 0 || !item.isEffective) // 无效商品

  },
  mutations: {
    // 添加购物车
    addCart (state, payload) {
      // 查找是否已经添加过，拿索引
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      // 如果添加过
      if (sameIndex > -1) {
        // 原来的数量赋值给此次添加的数量
        payload.count += state.list[sameIndex].count
        // 删除原来
        state.list.splice(sameIndex, 1)
      }
      // 追加新的到最前边
      state.list.unshift(payload)
    },
    // 更新购物车商品信息
    updateCart (state, goods) { // goods为商品的部分属性
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      // 遍历信息，修改state
      for (const key in goods) {
        // 有些字段是bool类型，特殊处理
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 修改商品sku
    updateCartSku (state, { oldGoods, newGoods }) {
      for (const key in newGoods) {
        // 有些字段是bool类型，特殊处理
        if (newGoods[key] !== undefined && newGoods[key] !== null && newGoods[key] !== '') {
          oldGoods[key] = newGoods[key]
        }
      }
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 初始化时更新购物车数据
    getCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          getCart().then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else { // 本地
          // 创建并发的primise数组
          const promiseArr = context.state.list.map(goods => getNewCartGoods(goods.skuId))
          // 同时请求,用结果更新本地购物车
          Promise.all(promiseArr).then(datalist => {
            datalist.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    // 添加到购物车
    addCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          addCart({ skuId: payload.skuId, count: payload.count })
            .then(() => {
              return getCart()
            }).then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else { // 本地
          context.commit('addCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车的某一商品
    deleteCart (context, skuId) {
      // 单条删除
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          deleteCart([skuId]).then(() => {
            return getCart()
          }).then(data => {
            context.commit('setCart', data.result)
          })
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 修改购物车
    updateCart (context, payload) {
      // 单条修改
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          updateCart(payload).then(() => {
            return getCart()
          }).then(data => {
            context.commit('setCart', data.result)
          })
        } else {
          context.commit('updateCart', payload) // payload为对象，其中要修改的属性不确定
          resolve()
        }
      })
    },
    // 全选和取消全选、
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          // 拿有效商品的skuId集合
          const ids = context.getters.validList
            .map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return getCart()
          }).then(data => {
            context.commit('setCart', data.result)
          })
        } else {
          context.getters.validList.forEach(item => { // 修改所有有效商品的selected
            context.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除 或 清除无效商品
    batchDeleteCart (context, isClearInvalid) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) { // 已登录
          // 拿要删除的skuId的集合
          const ids = context.getters[isClearInvalid ? 'invalidList' : 'selectedList']
            .map(item => item.skuId)
            // 调用批量删除接口
          deleteCart(ids).then(() => {
            return getCart() // 调用拉取购物车数据接口
          }).then(data => {
            context.commit('setCart', data.result) // 渲染
          })
        } else { // 本地\
          context.getters[isClearInvalid ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 购物车修改规格
    updateCartSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return addCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return getCart()
          }).then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 要修改的商品
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          // 修改后可能要合并sku的商品
          const sameGoods = context.state.list.find(item => item.skuId === newSku.skuId)
          let count = oldGoods.count // 旧商品的数量
          if (sameGoods && sameGoods.skuId) { // 如果有相同商品，把该商品数量与旧商品数量相加，并删除该商品
            count += sameGoods.count
            context.commit('deleteCart', sameGoods.skuId)
          }
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku // sku组件传给父组件的值
          const newGoods = { skuId, nowPrice, stock, attrsText, count } // 修改后的新商品
          context.commit('updateCartSku', { oldGoods, newGoods }) // 旧商品和修改后的商品数据交给mutations修改
          resolve()
        }
      })
    },
    // 合并购物车
    async mergeCart (context) {
      // 本地购物车列表参数
      const cartList = context.state.list.map(item => (
        {
          skuId: item.skuId,
          count: item.count,
          selected: item.selected
        }))
      await mergeCart(cartList)
      context.commit('setCart', []) // 清空本地购物车
    }

  }
}
