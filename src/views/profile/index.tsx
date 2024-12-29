import { defineComponent, ref } from 'vue'

import { useLogin } from '@/store'
import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList, toParse, setObj } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

import BasicInfo from './components/basicInfo'
import Address from './components/address'
import Order from './components/order'
// import Safe from './components/safe'

const { getData, get, post } = request

export interface BasicInfo {
  id: number
  email: string
  birthday: Date
  create_time: null
  name: string
  mobile: string
  gender: string
  password: string
}

enum Com {
  // BasicInfo,
  BasicInfo = 1,
  Address,
  Order,
  Safe,
}

import styles from './index.module.scss'

export default defineComponent({
  name: 'ProfileView',
  setup(props, ctx) {
    const activeIndex = ref(1)
    // const router = useRouter()
    // const { username, isLogin, setIsLogin, setUsername } = useLogin()

    const changeComponent = (index: number) => {
      activeIndex.value = index
    }

    const renderComponent = () => {
      return {
        [Com.BasicInfo]: <BasicInfo />,
        [Com.Address]: <Address />,
        [Com.Order]: <Order />,
        // [Com.Safe]: <Safe />,
      }[activeIndex.value]
    }
    return () => (
      <div>
        {/* <Shortcut /> */}
        <div class={[styles.profile]}>
          <div class={styles.header}>
            <div class={`${styles.title} clearfix`}>
              <div class={`${styles.logo} fl`}>{/* <Logo /> */}</div>
              <div class={`${styles['shop-name']} fl`}>小U商城</div>
              <div class={`${styles.name} fl`}>个人中心</div>
              <div class={`${styles.cart} fr`}>{/* <ShopCart /> */}</div>
            </div>
          </div>
          <div class={`${styles.main} clearfix`}>
            <div class={styles.content}>
              <div class={`${styles['left-menu']} fl`}>
                <div
                  class={`${activeIndex.value === 1 ? styles['active-menu'] : ''} ${styles.basic}`}
                  onClick={() => changeComponent(1)}
                >
                  基本信息
                </div>
                <div
                  class={`${activeIndex.value === 2 ? styles['active-menu'] : ''} ${styles.address}`}
                  onClick={() => changeComponent(2)}
                >
                  地址管理
                </div>
                <div
                  class={`${activeIndex.value === 3 ? styles['active-menu'] : ''} ${styles.order}`}
                  onClick={() => changeComponent(3)}
                >
                  我的订单
                </div>
                {/* <div
                  class={`${activeIndex.value === 4 ? styles['active-menu'] : ''} ${styles.security}`}
                  onClick={() => changeComponent(4)}
                >
                  安全设置
                </div> */}
              </div>
              <div class={`${styles['right-content']} fl`}>{renderComponent()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
