import { defineStore } from 'pinia'

export const useCart = defineStore('login', {
  state: () => ({
    cart: '',
  }),
  actions: {
    setCart(cart: string) {
      this.cart = cart
    },
  },
})
