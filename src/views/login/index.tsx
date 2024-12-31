import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// import Logo from './Logo'  // 假设你有一个 Logo 组件
import styles from './index.module.scss' // 假设你使用了 CSS Modules
import warning from '@/assets/images/login/warning.png'
import username from '@/assets/images/login/username.png'
import password from '@/assets/images/login/password.png'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { useLogin } from '@/store'

const { getData, post } = request

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()

    const { setIsLogin, setUsername } = useLogin()
    const userInfo = ref({
      username: '',
      password: '',
    })

    const login = () => {
      console.log('用户名:', userInfo.value.username)
      console.log('密码:', userInfo.value.password)
      // 你的登录逻辑

      getData(post(URLS.user_login, userInfo.value), (res) => {
        console.log('login', res)
        if (res.status == 4000) {
          alert('登录成功')
          window.localStorage.setItem('token', res.data.token)
          window.localStorage.setItem('username', res.data.username)
          setIsLogin(true)
          setUsername(res.data.username)
          router.push('/')
        } else {
          alert(res.data)
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
              <a href="#" class={styles['forget-password']}>
                忘记密码
              </a>
              <button class={styles['login-commit']} onClick={login}>
                登录
              </button>
              <div class={styles.register}>
                <a href="#">立即注册</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
