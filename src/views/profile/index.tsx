import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

import BasicInfo from './components/basicInfo'
import Address from './components/address'
import Order from './components/order'
import HomeHeader from '../header'

import styles from './index.module.scss'

enum Com {
  BasicInfo = 1,
  Address,
  Order,
  Safe,
}

export default defineComponent({
  name: 'ProfileView',
  setup(props, ctx) {
    const route = useRoute()
    const activeIndex = ref(+route.params.chooseIndex || 1)
    const changeComponent = (index: number) => {
      activeIndex.value = index
    }

    const renderComponent = () => {
      return {
        [Com.BasicInfo]: <BasicInfo />,
        [Com.Address]: <Address />,
        [Com.Order]: <Order />,
      }[activeIndex.value]
    }
    return () => (
      <div>
        {/* <Shortcut /> */}
        <div class={[styles.profile]}>
          <HomeHeader />
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
              </div>
              <div class={`${styles['right-content']} fl`}>{renderComponent()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
