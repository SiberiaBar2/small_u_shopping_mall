import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useLogin } from '@/store'
import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList, setObj } from '@/utils'

const { getData, post, get } = request

import styles from './index.module.scss'

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
  name: 'OrderPayment',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const { username, isLogin, setIsLogin, setUsername } = useLogin()
    const allAddresses = reactive<Address[]>([])
    const goodsInfo = reactive<any[]>([])

    const orderAmount = ref(0)
    const requestAddressData = () => {
      getData(
        post(URLS.address_list, {
          username: username,
        }),
        (res) => {
          setList(allAddresses, res?.data)
          changeSelected(allAddresses[0].id!)
        },
      )
    }
    const requestOrderGoods = () => {
      getData(get(URLS.order_goods + `/${route.params.trade_no}`), (res) => {
        setList(goodsInfo, res?.data?.order_goods)
        orderAmount.value = res.data.order_amount
      })
    }

    const requestOrderPay = () => {
      const orderParams = {
        address_id: selectedAddressId.value,
        trade_no: route.params.trade_no,
        pay_status: 1, // 提交订单后状态为支付中
      }
      getData(post(URLS.order_update, orderParams), (res) => {
        // setList(goodsInfo, res?.data?.order_goods)
        // orderAmount.value = res.data.order_amount
        console.log('resresres', res)

        router.push({
          name: 'OrderPay',
          query: {
            tradeNo: route.params.trade_no,
            orderAmount: orderAmount.value,
          },
        })
      })
    }

    onMounted(() => {
      requestAddressData()
      requestOrderGoods()
    })

    const selectedAddressId = ref(0)
    const changeSelected = (id: number) => {
      allAddresses.forEach((element) => {
        if (element.id == id) {
          element.selected = true
          selectedAddressId.value = id
        } else {
          element.selected = false
        }
      })
    }
    return () => (
      <div>
        {/* <Shortcut /> */}
        <div class={[styles.order, 'pacen']}>
          <div class={styles.header}>
            <div class={[styles.title, 'clearfix']}>
              <div class={[styles.logo, 'fl']}>{/* <Logo /> */}</div>
              <div class={[styles['shop-name'], 'fl']}>小U商城</div>
              <div class={[styles.name, 'fl']}>结算页</div>
            </div>
          </div>
          <div class={styles['title-text']}>填写并核对订单信息</div>
          <div class={styles['order-info']}>
            <div class="clearfix">
              <div class={[styles['step-title'], 'fl']}>
                <h3>收货人信息</h3>
              </div>
              <div class={[styles['add-address'], 'fr']}>新增收货地址</div>
            </div>

            {/* 需要循环的地方 */}
            {allAddresses.map((item, index) => {
              return (
                <div class={styles['step-context']} key={index}>
                  <span
                    class={[
                      styles['address-name'],
                      'cs',
                      (() => {
                        console.log('item.selected', item.selected)
                        if (item.selected) return styles.selected
                        return ''
                      })(),
                    ]}
                    onClick={() => changeSelected(item?.id!)}
                  >
                    {item.signer_name}
                  </span>
                  <span class={styles['address-info']}>{item.signer_address}</span>
                  <span class={styles['address-phone']}>{item.telphone}</span>
                  {item.default === 1 && <span class={styles['address-default']}>默认地址</span>}
                </div>
              )
            })}
            <hr />
            <div class={styles['step-title']}>
              <h3>支付方式</h3>
            </div>
            <div class={styles['step-context']}>
              <div class={[styles['pay-mode'], styles.selected]}>支付宝支付</div>
            </div>
            <hr />
            <div class={styles['step-title']}>
              <h3>送货清单</h3>
            </div>
            <div class={[styles['step-context'], 'clearfix']}>
              <div class={[styles['post-mode'], 'fl']}>
                <div>配送方式</div>
                <div class={styles.selected}>小U快递</div>
                <div>
                  标准达: <i>预计 6月1日[周四] 09:00-15:00 送达</i>
                </div>
              </div>
              <div class={[styles['goods-list'], 'fl']}>
                {goodsInfo.map((item, index) => (
                  <div key={index}>
                    <div class={styles['goods-shop-name']}>商家:{item.shop_name}</div>
                    <div>
                      <img src={item.image} alt="" />
                      <span class={styles['goods-name']}>{item.name}</span>
                      <span class={styles['goods-price']}>{item.p_price}</span>
                      <span class={styles['goods-num']}>x{item.goods_num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div class={styles['trade-foot']}>
            <span>应付金额:</span>
            <span class={styles['count-price']}>￥{orderAmount.value}</span>
          </div>
          <div class={styles['commit-order']}>
            <button class={styles['commit-order-button']} onClick={requestOrderPay}>
              提交订单
            </button>
          </div>
        </div>
      </div>
    )
  },
})
