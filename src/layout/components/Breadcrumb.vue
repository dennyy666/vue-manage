<template>
    <header>
        <div class="left">
            <span>
                <el-icon>
                    <Fold />
                </el-icon>
            </span>
        </div>
        <div v-if="store.name" class="right">
            <el-dropdown trigger="hover">
                <div class="user-menu">
                    <img :src="avatarUrl" alt="avatar" />
                    <span>{{ store.name }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
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
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { openExternalLink } from '@/utils'
import { useUserStore } from '@/stores/user'

const store = useUserStore()

const avatarUrl = computed(() => {
    const map: Record<string, string> = {
        'avatar1.png': new URL('@/assets/avatar1.png', import.meta.url).href,
        'avatar2.png': new URL('@/assets/avatar2.png', import.meta.url).href,
    }
    return map[store.avatar] || ''
})
const router = useRouter()
const openGithub = () => {
    openExternalLink('https://github.com/dennyy666/vue-manage', '_blank')
}
const loginOut = async () => {
    try {
        await ElMessageBox.confirm('您确定要退出Vue3 admin', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        })
        await router.push('/login')
        ElMessage.success('退出登录成功')
    } catch {

    }
}

const open = () => {
    ElMessageBox.confirm(
        '您确定要退出Vue3 admin',
        'Warning',
        {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        }
    )
        .then(() => {
            router.push('/login')
            ElMessage.success('退出登录成功')
        })
        .catch(() => {

        })
}


</script>
<style scoped lang="less">
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
</style>