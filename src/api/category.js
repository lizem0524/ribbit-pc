import request from '@/utils/request'

/**
 *获取所有分类(顶级，二级，对应的商品)
 * @returns Promise
 */
export const getAllCategory = () => request('/home/category/head', 'get')

/**
 * 获取顶级类目
 * @param {String} id 顶级类目id
 * @returns Promise
 */
export const getTopCategory = (id) => request('/category', 'get', { id })

/**
 * 获取二级类目筛选数据
 * @param {String} id 二级类目id
 * @returns Promise
 */
export const getSubCategoryFilter = (id) => request('/category/sub/filter', 'get', { id })

/**
 * 获取分类下的商品(带筛选条件)
 * @param {Object} data
 * @returns Promise
 */
export const getSubCategoryGoods = (data) => request('/category/goods/temporary', 'post', data)
