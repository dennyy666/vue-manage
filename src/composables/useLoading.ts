import { ref } from 'vue'
import { ElLoading } from 'element-plus'

let loadingCount = 0
let loadingInstance:any = null

export function useLoading() {
  const isLoading = ref(false)

  const startLoading = () => {
    loadingCount++
    if (loadingCount === 1) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      isLoading.value = true
    }
  }

  const endLoading = () => {
    if (loadingCount > 0) loadingCount--
    if (loadingCount === 0 && loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
      isLoading.value = false
    }
  }

  return { isLoading, startLoading, endLoading }
}