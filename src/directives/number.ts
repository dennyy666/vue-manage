import type { Directive, DirectiveBinding } from 'vue'

interface NumberDirectiveEl extends HTMLElement {
  __numberHandler__?: (e: Event) => void
  __numberInput__?: HTMLInputElement
}

/**
 * v-number
 * 仅允许输入纯数字，非数字字符会被实时过滤掉
 * 不限制长度，长度请用 maxlength 属性或表单校验控制
 *
 * 用法：
 *   <el-input v-model="form.mobile" v-number />
 *   <input v-model="form.code" v-number />
 */
const numberDirective: Directive<NumberDirectiveEl> = {
  mounted(el, binding) {
    // el-input 的根节点是 div，需要向下查找原生 input
    const input = (el.tagName === 'INPUT'
      ? el
      : el.querySelector('input')) as HTMLInputElement | null

    if (!input) return

    const handler = () => {
      const filtered = input.value.replace(/\D/g, '')
      // 只有值真的被改动时才回写并派发 input 事件
      // 避免死循环，同时让 v-model 能拿到过滤后的值
      if (input.value !== filtered) {
        input.value = filtered
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    input.addEventListener('input', handler)

    el.__numberInput__ = input
    el.__numberHandler__ = handler
  },

  unmounted(el) {
    if (el.__numberInput__ && el.__numberHandler__) {
      el.__numberInput__.removeEventListener('input', el.__numberHandler__)
    }
    delete el.__numberInput__
    delete el.__numberHandler__
  },
}

export default numberDirective