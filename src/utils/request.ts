import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useLoading } from '@/composables/useLoading'

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: import.meta.env.VITE_API_TIMEOUT,
  withCredentials: true,   // 跨域携带 Cookie
})

// Loading 控制（可选，按需开启）
let { startLoading, endLoading } = useLoading()

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 开启 Loading（可配置某些请求不开启）
    if (config.showLoading !== false) {
      startLoading()
    }

    // 添加 Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 其他公共 headers
    config.headers['Content-Type'] = 'application/json'

    return config
  },
  (error) => {
    if (error.config?.showLoading !== false) {
      endLoading()
    }
    ElMessage.error('请求配置错误')
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { config, data } = response
    console.log('响应数据:', data)
    console.log('响应配置:', config)
    if (config.showLoading !== false) {
      endLoading()
    }

    // 根据业务状态码判断
    const code = data.code
    if (code === 200) {
      return data.data  // 直接返回业务数据
    } else if (code === 401) {
      // Token 过期或未登录
      ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        window.location.href = '/login'
      })
      return Promise.reject(new Error('未授权'))
    } else {
      // 其他业务错误
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || 'Error'))
    }
  },
  (error) => {
    // HTTP 错误处理
    const { config, message, response } = error
    if (config?.showLoading !== false) {
      endLoading()
    }

    let errMsg = ''
    if (response) {
      switch (response.status) {
        case 400:
          errMsg = '请求错误'
          break
        case 401:
          errMsg = '未授权，请登录'
          // 可触发重新登录
          break
        case 403:
          errMsg = '拒绝访问'
          break
        case 404:
          errMsg = '请求地址不存在'
          break
        case 500:
          errMsg = '服务器内部错误'
          break
        default:
          errMsg = `连接错误${response.status}`
      }
    } else if (message.includes('timeout')) {
      errMsg = '请求超时，请稍后重试'
    } else if (message.includes('Network Error')) {
      errMsg = '网络异常，请检查网络连接'
    } else {
      errMsg = '请求失败'
    }

    ElMessage.error(errMsg)
    return Promise.reject(error)
  }
)

// 封装请求方法（可选，方便调用）
export const http = {
  get: (url:string, params:{ [key: string]: any }, config = {}) => service.get(url, { params, ...config }),
  post: (url:string, data:{ [key: string]: any }, config = {}) => service.post(url, data, config),
  put: (url:string, data:{ [key: string]: any }, config = {}) => service.put(url, data, config),
  delete: (url:string, params:{ [key: string]: any }, config = {}) => service.delete(url, { params, ...config }),
}

export default service