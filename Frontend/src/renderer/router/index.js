import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/dash-board.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // {
    //   path: '/:catchAll(.*)',
    //   redirect: '/dashboard'
    // },
    {
      path: '/',
      name: 'dashboard',
      component: HomeView,
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {layout: 'main', auth: false},
    },
    {
      path: '/server-req',
      name: 'server-req',
      component: () => import('../views/server-request.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/vector-diagram',
      name: 'vectordiagram',
      component: () => import('../views/vector-diagram.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/table-diagram',
      name: 'tablediagram',
      component: () => import('../views/table-diagram.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/emodel',
      name: 'emodel',
      component: () => import('../views/e-model.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/epmodel',
      name: 'epmodel',
      component: () => import('../views/ep-model.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/graph-panel',
      name: 'graphpanel',
      component: () => import('../views/graph-panel.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('../views/report.vue'),
      meta: {layout: 'main', auth: true},
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings.vue'),
      meta: {layout: 'main', auth: true},
    },
  ]
})
router.beforeEach((to, from, next) => {
  if((to.name != 'login')&&(!localStorage.getItem('session'))&&(to.meta.auth != undefined)){
    next({path: '/login'})
  }else{
    next()
  }
})


export default router