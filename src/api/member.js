import request from '@/utils/request'

/**
 * 获取收藏数据
 * @param {Integer} page  页码
 * @param {Integer} pageSize 每页条数
 * @param {Integer} collectType 收藏类型，1为商品，2为专题，3为品牌
 * @returns
 */
export const getCollect = ({ page = 1, pageSize = 10, collectType = 1 }) =>
  request('/member/collect', 'get', { page, pageSize, collectType })

/**
 * 获取我的足迹
 * @param {Integer} page  页码
 * @param {Integer} pageSize 每页条数
 * @returns
 */
export const getBrowseHistory = ({ page = 1, pageSize = 10 }) =>
  request('/member/browseHistory', 'get', { page, pageSize })
