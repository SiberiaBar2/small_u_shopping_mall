import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

// import Logo from './Logo'  // 假设你有一个 Logo 组件
import styles from './index.module.scss' // 假设你使用了 CSS Modules
import warning from '@/assets/images/login/warning.png'
import username from '@/assets/images/login/username.png'
import password from '@/assets/images/login/password.png'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { useLogin } from '@/store'

const { getData, post } = request

type Login = {
  username: string
  password: string
  passwordre?: string
}

export default defineComponent({
  name: 'LoginView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const message = useMessage()
    const isRegister = ref(route.params.isregister === 'register' || false)

    const { setIsLogin, setUsername } = useLogin()
    const userInfo = ref<Login>({
      username: '',
      password: '',
      passwordre: '',
    })

    const login = () => {
      const params = { ...userInfo.value }
      delete params.passwordre

      getData(post(URLS.user_login, params), (res) => {
        console.log('login', res)
        if (res.status == 4000) {
          message.success('登录成功')
          setTimeout(() => {
            window.localStorage.setItem('token', res.data.token)
            window.localStorage.setItem('username', res.data.username)
            setIsLogin(true)
            setUsername(res.data.username)
            router.push('/')
          }, 300)
        } else {
          message.error(res.data)
        }
      })
    }

    const register = () => {
      if (userInfo.value.password !== userInfo.value.passwordre) {
        return message.error('两次密码不一致！')
      }
      const params = { ...userInfo.value }
      delete params.passwordre
      getData(post(URLS.user_register, params), (res) => {
        if (res.status == 4000) {
          message.success('注册成功，请登录')
          isRegister.value = false
        } else {
          message.error(res?.data)
        }
      })
    }

    return () => (
      <div class={styles.login}>
        <div class={[styles.title, 'clearfix']}>
          <div class={[styles.name, 'fl']}>小U商城</div>
          <div class={[styles.name, 'fl']}>欢迎登录</div>
        </div>
        <div class={styles['login-info']}>
          <div class={styles['login-content']}>
            <div class={styles['login-text']}>
              <div class={styles.title}>
                <img src={warning} alt="" />
                我不会以任何理由要求你转账，谨防诈骗。
              </div>
              <div class={styles['login-name']}>账户登录</div>
              <div class={styles['login-username']}>
                <label for="username">
                  <img src={username} alt="" />
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="请输入你的邮箱"
                  v-model={userInfo.value.username}
                />
              </div>
              <div class={styles['login-password']}>
                <label for="password">
                  <img src={password} alt="" />
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="请输入密码"
                  v-model={userInfo.value.password}
                />
              </div>
              {isRegister.value ? (
                <div class={styles['login-password']}>
                  <label for="passwordre">
                    <img src={password} alt="" />
                  </label>
                  <input
                    type="password"
                    id="passwordre"
                    placeholder="请再次输入密码"
                    v-model={userInfo.value.passwordre}
                  />
                </div>
              ) : null}
              <a href="#" class={styles['forget-password']}>
                忘记密码
              </a>
              <button
                class={styles['login-commit']}
                onClick={() => {
                  if (isRegister.value) {
                    register()
                  } else {
                    login()
                  }
                }}
              >
                {isRegister.value ? '注册' : '登录'}
              </button>
              <div class={styles.register}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    isRegister.value = !isRegister.value
                  }}
                >
                  {!isRegister.value ? '立即注册' : '登录'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
