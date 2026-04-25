<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import avatarImg from '../assets/avatar.png'
import logoImg from '../assets/mlogo.png'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)
const user = ref<{ username: string } | null>({ username: 'Admin' })

const activeUrl = computed(() => route.path)
const isHomeManageActive = computed(() => activeUrl.value.includes('/pages/homeManage'))
const isExampleManageActive = computed(() => activeUrl.value.includes('/pages/exampleManage'))

const toggle = () => {
  isCollapsed.value = !isCollapsed.value
}

const baidu = () => {
  window.open('https://www.baidu.com', '_blank')
}

const openGithub = () => {
  window.open('https://github.com/dennyy666/manage-angular', '_blank')
}

const jumpNotFound = () => {
  router.push('/pages/homeManage/notFound')
}

const loginOut = async () => {
  try {
    await ElMessageBox.confirm('您确定要退出Angular admin', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    })
    user.value = null
    await router.push('/login')
    ElMessage.success('退出登录成功')
  } catch {
    // User cancelled logout.
  }
}
</script>

<template>
  <div class="pags-contain">
    <aside :class="{ collapsed: isCollapsed }">
      <div class="head">
        <img :src="logoImg" alt="logo" />
        <span>Angular admin</span>
      </div>
      <div class="line"></div>
      <ul class="menu-list">
        <li class="menu-group">
          <div class="group-title" :class="{ open: isHomeManageActive }">首页配置</div>
          <ul class="group-items">
            <li :class="{ selected: isHomeManageActive }">
              <router-link to="/pages/homeManage/heroManage">英雄管理</router-link>
            </li>
            <li @click="baidu">百度一下啦</li>
            <li @click="jumpNotFound">404 页面</li>
          </ul>
        </li>
        <li class="menu-group">
          <div class="group-title" :class="{ open: isExampleManageActive }">示例页栏目</div>
          <ul class="group-items">
            <li :class="{ selected: isExampleManageActive }">
              <router-link to="/pages/exampleManage/exampleForm">表单验证</router-link>
            </li>
          </ul>
        </li>
        <li class="menu-item">svg-图标</li>
        <li class="menu-item" @click="openGithub">项目地址</li>
      </ul>
    </aside>
    <div class="content-box">
      <header>
        <div class="left">
          <button class="fold" type="button" @click="toggle">{{ isCollapsed ? '展开' : '折叠' }}</button>
          <span class="breadcrumb">{{ activeUrl }}</span>
        </div>
        <div v-if="user" class="right">
          <el-dropdown trigger="click">
            <div class="user-menu">
              <img :src="avatarImg" alt="avatar" />
              <span>{{ user.username }}</span>
              <span class="menu-down-icon">▼</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openGithub">github地址</el-dropdown-item>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <main>
        <div class="card">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
.pags-contain {
  height: 100vh;
  display: flex;
  background-color: #eeeeee;

  aside {
    flex-shrink: 0;
    width: 220px;
    background-color: #001529;
    overflow: hidden auto;
    transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
    opacity: 1;

    &.collapsed {
      width: 0;
      opacity: 0;
    }

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

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 8px 0;
      color: #d5d5d5;

      li {
        cursor: pointer;
      }

      .menu-group {
        margin-bottom: 4px;
      }

      .group-title {
        padding: 10px 16px;
        color: #fff;
      }

      .group-title.open {
        background: rgba(255, 255, 255, 0.08);
      }

      .group-items {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          padding: 8px 24px;
        }

        li.selected {
          background: #1677ff;
          color: #fff;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      }

      .menu-item {
        padding: 10px 16px;
      }
    }
  }

  .content-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    header {
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;

      .left {
        display: flex;
        align-items: center;
        gap: 8px;

        .fold {
          border: 1px solid #d9d9d9;
          background: #fff;
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
        }

        .breadcrumb {
          color: #666;
          font-size: 13px;
        }
      }

      .right {
        display: flex;
        align-items: center;
        height: 100%;
        color: #001529;

        .user-menu {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;

          img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: inline-block;
          }

          .menu-down-icon {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    main {
      height: calc(100vh - 50px);
      overflow: auto;
      padding: 10px;

      .card {
        width: 100%;
        min-height: 100%;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        overflow: hidden;
        color: #303133;
      }
    }
  }
}
</style>
