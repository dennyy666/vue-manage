import type { App } from 'vue'
import number from './number'

export default {
  install(app: App) {
    app.directive('number', number)
  },
}