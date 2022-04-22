import request from '@/utils/request'

/**
 * 获取购物车选中商品生成订单
 * @returns
 */
export const createOrder = () => request('/member/order/pre', 'get')

// 根据订单id生成订单(再次购买)
export const repurchaseOrder = (orderId) => request('/member/order/repurchase/' + orderId, 'get')
/**
 * 获取收货地址
 */
export const getAddress = () => request('/member/address', 'get')

/**
 * 添加收货地址
 * @param {Object} form -参考文档
 */
export const addAddress = form => request('/member/address', 'post', form)

/**
 * 修改收货地址
 * @param {Object} form
 * @returns
 */
export const editAddress = form => request(`/member/address/${form.id}`, 'put', form)

/**
 * 删除收货地址
 * @param {String} id -地址id
 * @returns
 */
export const deleteAddress = (id) => request(`/member/address/${id}`, 'delete')

/**
 * 结算页面，提交订单
 * @param {Object} params -参考文档
 * @returns
 */
export const submitOrder = (params) => request('/member/order', 'post', params)
