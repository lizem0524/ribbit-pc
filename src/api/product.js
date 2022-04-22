import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id 商品id
 */
export const getGoods = id => request('/goods', 'get', { id })

/**
 *获取推荐列表
 * @param {String} -商品ID,传入相关推荐，不穿猜你喜欢
 * @param {Integer} -商品数量
 */
export const getRelevantGoods = ({ id, limit = 16 }) => request('/goods/relevant', 'get', { id, limit })

/**
 *获取热销榜数据
 * @param {String} id -商品ID
 * @param {Integer} limit -商品数量
 * @param {Integer} type - 热销类型
 */
export const getGoodsHot = ({ id, limit = 3, type = 1 }) => request('/goods/hot', 'get', { id, limit, type })

/**
 * 查询商品评价信息
 * @param {String} -商品id
 * @returns
 */
export const getGoodsComment = (id) => request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')

/**
 * 筛选商品评价
 * @param {String} id -商品ID
 * @param {Object} params -评价筛选条件
 * @returns
 */
export const getGoodsCommentList = (id, params) => request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
