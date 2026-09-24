<template>
    <div class="login-page">
        <div class="content">
            <div class="title">XXX后台管理平台</div>
            <div class="form-box">
                <div class="login-form">
                    <div class="login-title">平台登录</div>
                    <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
                        <el-form-item prop="account">
                            <el-input v-model="form.account" placeholder="请输入账号" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" placeholder="请输入密码" show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-button" type="primary" native-type="submit">登录</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox>记住账号/密码</el-checkbox>
                        </el-form-item>
                    </el-form>
                    <div class="tips f-vertical">
                        <el-button type="primary" class="green" @click="copy('姬虚空')">点击复制</el-button>
                        <div>账号: 姬虚空; 密码: 随便填</div>
                        <el-button type="primary" @click="performLogin('姬虚空')">一键登录</el-button>
                    </div>
                    <div class="tips f-vertical">
                        <el-button type="primary" class="green" @click="copy('酒剑仙')">点击复制</el-button>
                        <div>账号: 酒剑仙; 密码: 随便填</div>
                        <el-button type="primary" @click="performLogin('酒剑仙')">一键登录</el-button>
                    </div>
                </div>
            </div>
            <div class="bottom-text">
                Copyright © dennyy666.github.io All Rights Reserved 请使用 Google Chrome、Microsoft Edge、360浏览器、非 IE
                等浏览器
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
interface LoginForm {
    account: string
    password: string
}

interface UserInfo {
    name: string
    avatar: string
    address: string
    phone: string
}

const formRef = ref<FormInstance>()
const form = reactive<LoginForm>({
    account: '',
    password: '',
})

const rules: FormRules<LoginForm> = {
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const userInfos: UserInfo[] = [
    { name: '姬虚空', avatar: 'https://i.cetsteam.com/imgs/2026/05/08/38f2f5af2c44bbab.jpg', address: '地球', phone: '12345678901' },
    { name: '酒剑仙', avatar: 'https://s41.ax1x.com/2026/05/07/pebOEv9.jpg', address: '天涯', phone: '19876543210' },
]

const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
    } catch {
        return
    }
    performLogin(form.account, form.password)
}

const performLogin = async (account: string, _password = '123456') => {
    const user = userInfos.find((u) => u.name === account)
    if (!user) {
        ElMessage.warning('用户名或者密码错误')
        return
    }
    router.push('/layout')
    ElMessage.success('登录成功')
}

const copy = async (account: string) => {
    try {
        await navigator.clipboard.writeText(account)
        ElMessage.success('复制成功')
    } catch {
        ElMessage.success('复制失败')
    }
}
</script>


<style scoped lang="less">
.login-page {
    width: 100%;
    height: 100vh;
    background-color: #2253dc;
    position: relative;
    z-index: 1;
    background-image: url(@/assets/admin-login-bg.jpg);
    background-size: cover;
    background-position: center center;
    min-width: 1200px;
    min-height: 800px;

    .content {
        position: absolute;
        z-index: 3;
        top: 50%;
        margin-top: -302px;
        right: 10%;
        width: 100%;
        max-width: 480px;
    }

    .title {
        text-align: center;
        font-size: 28px;
        color: #fff;
        margin-bottom: 24px;
        text-shadow: 4px 4px 4px #333;
        font-family: '宋体';
    }

    .form-box {
        background-color: #81c7fa;
        border: solid 2px #3b9be5;
        padding: 10px;
        width: 100%;
        margin-bottom: 40px;

        .login-form {
            background-color: #fff;
            padding: 40px 40px 30px;

            .login-title {
                font-size: 22px;
                line-height: 22px;
                color: #1890ff;
                margin-bottom: 30px;
                text-align: center;
            }

            .login-button {
                width: 100%;
            }
        }
    }

    .tips {
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;

        .green {
            background-color: #4caf50;
            border-color: #4caf50;
        }
    }

    .f-vertical {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .bottom-text {
        width: 100%;
        max-width: 500px;
        font-size: 14px;
        color: #fffc;
        font-weight: 400;
        line-height: 22px;
        margin: 0 auto;
        text-align: center;
    }
}
</style>