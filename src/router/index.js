import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import { h } from 'vue'
import store from '@/store/'
const Layout = () => import('@/layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/TopCategory')
const SubCategory = () => import('@/views/category/SubCategory')
const Goods = () => import('@/views/goods')
const Cart = () => import('@/views/cart')

const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/callback')

const Checkout = () => import('@/views/member/checkout')
const Pay = () => import('@/views/member/pay')
const PayCallback = () => import('@/views/member/pay/callback')

const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order/order-list')
const MemberOrderDetail = () => import('@/views/member/order/order-detail')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: Checkout },
      { path: '/member/pay', component: Pay },
      { path: '/pay/callback', component: PayCallback },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '', component: MemberHome },
          {
            path: '/member/order',
            component: { render: () => h(RouterView) },
            children: [
              { path: '', component: MemberOrder },
              { path: '/member/order/:id', component: MemberOrderDetail }
            ]
          }
          // { path: '/member/order', component: MemberOrder },
          // { path: '/member/order/:id', component: MemberOrderDetal }
        ]
      }

    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: LoginCallback }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换路由时滚动到页面顶部 vue2.0 x y
  scrollBehavior () {
    return { top: 0, left: 0 }
  }
})
// 路由拦截
router.beforeEach(async (to, from, next) => {
  const { profile } = store.state.user
  // 未登录，去/member开头的要拦截
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})
export default router
