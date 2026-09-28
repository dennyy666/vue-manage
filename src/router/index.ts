import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../login/Login.vue'),
    },   
    {
      path: '/layout',
      name: 'layout',
      component: () => import('../layout/MainLayout.vue'),
      children: [
        {
          path: 'homeConfiguration/heroManage',
          name: 'heroManage',
          component: () => import('../views/homeConfiguration/heroManage/HeroManageView.vue'),
        },
      ],      
    } 
  ],
})

export default router
