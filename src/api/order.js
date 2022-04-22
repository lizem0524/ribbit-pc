import request from '@/utils/request'

/**
 * 根据订单id获取订单详情
 * @param {String} orderId 订单id
 * @returns
 */
export const getOrderDetail = (orderId) => request(`/member/order/${orderId}`, 'get')

/**
 *  获取订单列表
 * @param {Integer} page  -页码
 * @param {Integer} pageSize -每页条数
 * @param {Integer} orderState -订单状态
 * @returns
 */
export const getOrder = ({ page = 1, pageSize = 10, orderState = 0 }) => request('/member/order', 'get', { page, pageSize, orderState })

/**
 *  取消订单
 * @param {String} orderId -订单Id
 * @returns
 */
export const cancelOrder = ({ orderId, cancelReason }) => request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })

/**
 * 删除订单
 * @param {String} orderId - 订单ID
 * @returns
 */
export const deleteOrder = (orderId) => request('/member/order', 'delete', { ids: [orderId] })

/**
 * 确认收货
 * @param {String} orderId - 订单ID
 * @returns
 */
export const receiptOrder = (orderId) => request(`/member/order/${orderId}/receipt`, 'put')

/**
 * 查询物流
 * @param {String} orderId - 订单ID
 * @returns
 */
export const logisticsOrder = (orderId) => request(`/member/order/${orderId}/logistics`, 'get')
