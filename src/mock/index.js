import Mock from 'mockjs'
import qs from 'qs'
// 基本配置
Mock.setup({
  // 模拟延迟
  timeout: '300-600'
})
// 拦截接口
// 1.接口地址路径
// 2.请求方式
// 3.返回数据

// 个人中心-我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
  const counts = 35
  const queryString = config.url.split('?')[1]// 从url截取查询字符串
  const queryObject = qs.parse(queryString) // 查询字符串转对象
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@Integer(1,8)')}.jpg`
    }))
  }
  return {
    message: '获取数据成功',
    result: {
      counts,
      pageSize: queryObject.pageSize,
      page: queryObject.page,
      items
    }
  }
})

// 个人中心-我的足迹
Mock.mock(/\/member\/browseHistory/, 'get', config => {
  const counts = 35
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      browserTime: '@date',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@Integer(1,8)')}.jpg`
    }))
  }
  return {
    message: '获取数据成功',
    result: {
      counts,
      pageSize: queryObject.pageSize,
      page: queryObject.page,
      items
    }
  }
})
