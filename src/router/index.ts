import { createRouter, createWebHashHistory } from 'vue-router'
import { defineComponent, h } from 'vue'
import LoginView from '../login/LoginView.vue'
import PagesView from '../pages/PagesView.vue'

const HeroManageView = defineComponent({
  name: 'HeroManageView',
  setup() {
    return () => h('div', { class: 'page-placeholder' }, '英雄管理页面占位')
  },
})

const ExampleFormView = defineComponent({
  name: 'ExampleFormView',
  setup() {
    return () => h('div', { class: 'page-placeholder' }, '表单验证页面占位')
  },
})

const NotFoundView = defineComponent({
  name: 'NotFoundView',
  setup() {
    return () => h('div', { class: 'page-placeholder' }, '404 页面占位')
  },
})

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/pages',
      name: 'pages',
      component: PagesView,
      redirect: '/pages/homeManage/heroManage',
      children: [
        {
          path: 'homeManage/heroManage',
          name: 'hero-manage',
          component: HeroManageView,
        },
        {
          path: 'homeManage/notFound',
          name: 'home-not-found',
          component: NotFoundView,
        },
        {
          path: 'exampleManage/exampleForm',
          name: 'example-form',
          component: ExampleFormView,
        },
      ],
    },
  ],
})

export default router
