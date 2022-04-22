import request from '@/utils/request'

/**
 * 获取品牌
 * @param {Integer} limit - 品牌个数
 * @returns Promise
 */
export const getBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告轮播图
 * @returns Promis
 */
export const getBanner = () => request('/home/banner', 'get')

/**
 * 获取新鲜好物
 * @returns Promis
 */
export const getNew = () => request('/home/new', 'get')

/**
 * 获取人气推荐
 * @returns Promise
 */
export const getHot = () => request('/home/hot', 'get')

/**
 * 获取商品
 * @returns Promise
 */
export const getProduct = () => request('/home/goods', 'get')

/**
 * 获取最新专题
 * @returns Promise
 */
export const getSpecial = () => request('/home/special', 'get')
