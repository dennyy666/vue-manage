<template>
  <div class="head">
    <img :src="logoImg" alt="logo" />
    <span>Vue3 admin</span>
  </div>
  <div class="line"></div>
  <el-menu active-text-color="#ffd04b" background-color="#001529" text-color="#fff" :default-active="activeUrl"
    :unique-opened="true" style="border-right: none;">
    <el-sub-menu index="1">
      <template #title>首页配置</template>
      <el-menu-item index="1-1">英雄管理</el-menu-item>
      <el-menu-item index="1-2">英雄管理</el-menu-item>
      <el-menu-item index="1-3" @click="baidu">百度一下啦</el-menu-item>
      <el-menu-item index="1-4" @click="jumpNotFound">404 页面</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>表单管理</template>
      <el-menu-item index="2">实名认证流程</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">svg-图标</el-menu-item>
    <el-menu-item index="4" @click="openGithub">项目地址</el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { openExternalLink } from '@/utils'
import logoImg from '@/assets/mlogo.png'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeUrl = computed(() => route.path)
const baidu = () => {
  openExternalLink('https://www.baidu.com', '_blank')
}
const jumpNotFound = () => {
  router.push('/pages/homeManage/notFound')
}
const openGithub = () => {
  openExternalLink('https://github.com/dennyy666/vue-manage', '_blank')
}

</script>
<style scoped lang="less">
.head {
  display: flex;
  align-items: center;
  height: 50px;

  img {
    width: 50px;
    height: 50px;
    margin-left: 15px;
    margin-right: 10px;
  }

  span {
    font-size: 20px;
    color: #fff;
    white-space: nowrap;
  }
}

.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

:deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.65);

  &:hover {
    color: #fff;
  }
}

:deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: #fff;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);

  &:hover {
    color: #fff;
  }

  &.is-active {
    color: #fff;
    background-color: #1890ff;
  }
}

:deep(.el-sub-menu .el-menu-item) {
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: #fff;
  }

  &.is-active {
    color: #fff;
    background-color: #1890ff;
  }
}
</style>