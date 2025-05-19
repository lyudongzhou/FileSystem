// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue';
export const useAppStore = defineStore('app', () => {
  const user = ref<null | string>(null)
  const token = ref<null | string>(null)
  const queue = ref<string[]>([])
  function addQueue(message: any) {
    queue.value.push(message)
  }

  function setUser(username: string, access_token: string) {
    user.value = username
    token.value = access_token;
  }
  function login() { }
  function logout() {
    user.value = null
    token.value = null
  }
  return { user, token, queue, setUser, addQueue, logout }
}, { persist: true })
