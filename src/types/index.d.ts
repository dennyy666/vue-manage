import 'axios'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /**
     * 是否显示全局 Loading，默认为 true
     */
    showLoading?: boolean
  }
}

