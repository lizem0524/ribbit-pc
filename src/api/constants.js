// 常量数据
export const topCategory = [
  '居家',
  '美食',
  '服饰',
  '母婴',
  '个护',
  '严选',
  '数码',
  '运动',
  '杂货'
]
// 订单状态
export const orderStatus = [
  { name: 'all', label: '全部订单', state: 0 },
  { name: 'unpay', label: '待付款', state: 1 },
  { name: 'deliver', label: '待发货', state: 2 },
  { name: 'receive', label: '待收货', state: 3 },
  { name: 'comment', label: '待评价', state: 4 },
  { name: 'complete', label: '已完成', state: 5 },
  { name: 'cancel', label: '已取消', state: 6 }
]

export const cancelReason = [
  '配送信息有误',
  '商品买错了',
  '重复下单/误下单',
  '忘记使用优惠券、兔币等',
  '其他渠道价格更低',
  '不想买了'
]
