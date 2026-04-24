import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../login/LoginView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

export default router
