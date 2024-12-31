import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import alipay from '@/assets/images/order/alipay.png'

import styles from './index.module.scss'

const { getData, post } = request

export interface Address {
  id?: number
  email?: string
  signer_name: string
  telphone: string
  signer_address: string
  district: string
  default?: number | boolean
  create_time?: string
  selected?: boolean
}

export default defineComponent({
  name: 'OrderPay',
  setup(props, ctx) {
    const route = useRoute()
    const tradeNo = ref()
    const orderAmount = ref()
    onMounted(() => {
      console.log('route.query', route.query)
      tradeNo.value = route.query.tradeNo
      orderAmount.value = route.query.orderAmount
    })
    const requestToAipay = () => {
      getData(
        post(URLS.pay_alipay, {
          tradeNo: tradeNo.value,
          orderAmount: orderAmount.value,
        }),
        (res) => {
          console.log('res', res)
          window.location.href = res.data.alipay
        },
      )
    }

    return () => (
      <div>
        {/* <Shortcut /> */}
        <div class={[styles['order-pay'], 'pacen']}>
          <div class={styles.header}>
            <div class={[styles.title, 'clearfix']}>
              <div class={[styles.logo, 'fl']}>{/* <Logo /> */}</div>
              <div class={[styles['shop-name'], 'fl']}>小U商城</div>
              <div class={[styles.name, 'fl']}>收银台</div>
            </div>
          </div>

          <div class={styles['order-info']}>
            <div class={styles['order-num']}>
              订单提交成功，请尽快付款！订单号:
              <span>{tradeNo.value}</span>
            </div>
            <div class={styles['pay-mode']}>
              <div>
                应付金额:
                <span class={styles['pay-count']}>{orderAmount.value}</span>元
              </div>
              <div class={styles.payTypeText}>
                <img src={alipay} alt="" />
                <span>支付宝支付</span>
              </div>
            </div>
            <div class={styles['pay-order']}>
              <button class={styles['pay-order-button']} onClick={requestToAipay}>
                立即支付
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
