import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { useLogin } from '@/store'

import styles from './index.module.scss'

export default defineComponent({
  name: 'HomeHeader',
  setup(props, ctx) {
    const router = useRouter()
    const { username, isLogin, setIsLogin, setUsername } = useLogin()
    return () => (
      <div class={styles.homeHeader}>
        <h3 class={styles.title} onClick={() => router.push('/')}>
          小U商城
        </h3>
        <div class={styles.right}>
          <div
            class={styles.items}
            onClick={() => {
              if (!username) return
              localStorage.removeItem('token')
              setIsLogin(false)
              setUsername('')
              window.location.reload()
              router.push('/')
            }}
          >
            退出登录
          </div>
          <div
            class={styles.items}
            onClick={() => {
              router.push('/cart/detail')
            }}
          >
            购物车
          </div>
          <div
            class={styles.items}
            onClick={() => {
              router.push(`/login/register`)
            }}
          >
            注册
          </div>
          {!isLogin ? (
            <div
              class={styles.items}
              onClick={() => {
                router.push('/login/1')
              }}
            >
              请登录
            </div>
          ) : (
            <div class={styles.items} onClick={() => router.push('/profile/1')}>
              {username}
            </div>
          )}

          <div class={styles.items}>你好，</div>
        </div>
      </div>
    )
  },
})
