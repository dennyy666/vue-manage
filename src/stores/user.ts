import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref<string>('')
  const avatar = ref<string>('')
  const address = ref<string>('')
  const phone = ref<string>('')
  const isCollapsed = ref<boolean>(false)

  function setUser(payload: { name?: string; avatar?: string; address?: string; phone?: string }) {
    if (payload.name !== undefined) name.value = payload.name
    if (payload.avatar !== undefined) avatar.value = payload.avatar
    if (payload.address !== undefined) address.value = payload.address
    if (payload.phone !== undefined) phone.value = payload.phone
  }

  function clearUser() {
    name.value = ''
    avatar.value = ''
    address.value = ''
    phone.value = ''
  }

  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    name,
    avatar,
    address,
    phone,
    isCollapsed,
    setUser,
    clearUser,
    toggleCollapse,
  }
}, {
  persist: true,
})