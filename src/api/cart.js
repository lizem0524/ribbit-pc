import request from '@/utils/request'

/**
 * 根据skuId获取商品最新价格 库存是否有效
 * @param {String} skuId -Sku id
 * @returns
 */
export const getNewCartGoods = skuId => request(`/goods/stock/${skuId}`, 'get')

/** 获取商品对应的sku数据
 *@param {String} skuId -Sku id
 */
export const getGoodsSku = skuId => request(`/goods/sku/${skuId}`, 'get')

/**
 * 合并购物车
 * @param {Array<object>} cartList  -购物车信息列表
 * @param {String} object.skuId  -skuId
 * @param {Boolean} object.selected  -选中状态
 * @param {Integer} object.count  -数量
 * @returns
 */
export const mergeCart = (cartList) => request('/member/cart/merge', 'post', cartList)

/**
 *  获取购物车列表
 * @returns
 */
export const getCart = () => request('/member/cart', 'get')

/**
 *  添加商品到购物车
 * @param {String} object.skuId -SKUID
 * @param {Integer} object.count -数量
 * @returns
 */
export const addCart = ({ skuId, count }) => request('/member/cart', 'post', { skuId, count })

/**
 * 删除购物车商品，可批量
 * @param {Array<String>} ids -skuId的集合
 * @returns
 */
export const deleteCart = (ids) => request('/member/cart', 'delete', { ids })

/**
 *
 * @param {String} param0 -skuId
 * @param {Integer} count -加入购物车数量
 * @param {Boolean} selected -选中状态
 * @returns
 */
export const updateCart = ({ skuId, selected, count }) => request(`/member/cart/${skuId}`, 'put', { selected, count })

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
