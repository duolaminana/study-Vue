import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', titleZh: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },

  {
    path: '/personal',
    component: Layout,
    name: 'personal',
    hidden: true,
    meta: { title: 'Personal', titleZh: '个人中心', icon: 'user' },
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/personal/userInfo'),
        meta: { title: 'UserInfo', titleZh: '个人资料' }
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => import('@/views/personal/changePassword'),
        meta: { title: 'Change Password', titleZh: '个人资料' }
      },
      {
        path: 'remind',
        name: 'remind',
        component: () => import('@/views/personal/remind'),
        meta: { title: 'Memorandum', titleZh: '备忘提醒' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
