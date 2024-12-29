import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView'

import { useLogin } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login'),
      meta: {
        title: '欢迎登录',
      },
    },
    {
      path: '/goods_list/:keyword/:page/:order',
      name: 'goodsList',
      component: () => import('../views/goods_list'),
      meta: {
        title: '商品搜索',
      },
    },
    {
      path: '/detail/:sku_id',
      name: 'goodsDetail',
      component: () => import('../views/goodsDetail'),
      meta: {
        title: '商品详情',
        isAuthRequired: true,
      },
    },
    {
      path: '/cart/detail',
      name: 'cart',
      component: () => import('../views/cart'),
      meta: {
        title: '购物车',
        // isAuthRequired:true
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile'),
      meta: {
        title: '订单',
        isAuthRequired: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isLogin } = useLogin()

  document.title = to.meta.title as string
  if (to.meta.isAuthRequired == true && !isLogin) {
    // windowC.$message?.warning('请先登录')
    router.push('/login')
  } else {
    next()
  }
})

export default router
