import { defineStore } from 'pinia'

export const useLogin = defineStore('login', {
  state: () => ({
    username: '',
    isLogin: false,
  }),
  actions: {
    setUsername(username: string) {
      this.username = username
    },
    setIsLogin(login: boolean) {
      this.isLogin = login
    },
  },
  persist: true,
})
