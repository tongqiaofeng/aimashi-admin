import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login,
      children: [
        {
          path:'/login',
          component: Login,
        }
      ]
    },
    { //主页
      path: '/home',
      name: 'home',
      component: () => import('@/components/home/home'),
      children: [
        {
          path: '/onsale',
          name: 'onsale',
          component: () => import('@/components/onSale/onSale'),
        },
        {
          path: '/sold',
          name: 'sold',
          component: () => import('@/components/sold/sold'),
        },  
        {
          path: '/export',
          name: 'export',
          component: () => import('@/components/export/export'),
        }
      ]
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/components/publish/publish'),
      meta:{ title: '发布商品' },
    }
  ]
})
