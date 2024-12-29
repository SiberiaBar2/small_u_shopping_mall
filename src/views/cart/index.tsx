import { defineComponent, onMounted, onUpdated, reactive, ref, watchEffect } from 'vue'
import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList, toParse } from '@/utils'
import { useLogin } from '@/store'
import { useRoute, useRouter } from 'vue-router'

const { getData, post } = request

export interface Cart {
  sku_id: string
  email: string
  nums: number
  is_delete: number
  goods: Goods
  checked?: boolean
}

export interface Goods {
  id: number
  image: string
  create_time: Date
  type_id: number
  name: string
  sku_id: string
  target_url: string
  jd_price: string
  p_price: string
  shop_name: string
  shop_id: number
  spu_id: string
  mk_price: string
  vender_id: number
  find: null
}

// import { ElInputNumber } from 'element-plus'
// import Shortcut from './Shortcut'
// import Header from './Header'
import styles from './index.module.scss'
import { NInput, NInputNumber } from 'naive-ui'

export default defineComponent({
  name: 'ShopCart',
  setup() {
    const router = useRouter()
    const { username } = useLogin()
    const count = ref(0)
    const cartListData = reactive<Cart[]>([])
    const requestFindGoods = () =>
      getData(post(URLS.cart_detail, { username: username }), (res) => {
        setList(cartListData, res?.data)
      })

    const requestCartCount = () =>
      getData(post(URLS.cart_count, { username: username }), (res) => {
        count.value = res?.data?.nums__sum
      })
    const requestUpdateCart = ({ sku_id, nums }: { sku_id: string; nums: number }) =>
      getData(post(URLS.cart_update, { username: username, sku_id, nums }), (res) => {
        // if (res.status == 3000) {
        //   console.log('成功')
        // }
      })
    const requestDeleteCart = ({ sku_id }: { sku_id: string }) =>
      getData(post(URLS.cart_delete, { username: username, sku_id }), (res) => {
        // if (res.status == 3000) {
        //   console.log('成功')
        // }
      })

    onMounted(() => {
      requestFindGoods()
      requestCartCount()
    })
    const cartSumNums = ref(1)
    const selectedGoodsCount = ref(0)
    const priceCount = ref(0)

    // 全选与取消全选的逻辑
    const allChecked = ref(false)
    const checkedAll = () => {
      priceCount.value = 0
      allChecked.value = !allChecked.value
      if (allChecked.value) {
        selectedGoodsCount.value = cartListData.length
      } else {
        selectedGoodsCount.value = 0
      }
      cartListData.forEach((item) => {
        item.checked = allChecked.value
        if (allChecked.value) {
          priceCount.value += +(Number(item.goods.p_price) * item.nums).toFixed(2)
        } else {
          priceCount.value -= +(Number(item.goods.p_price) * item.nums).toFixed(2)
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          priceCount.value < 0 ? (priceCount.value = 0) : null
        }
      })
    }

    // 单个选中与取消商品的逻辑
    const changeChecked = (item: Cart, key: number, check: boolean) => {
      cartListData[key].checked = check
      const price = +Number(item.goods.p_price).toFixed(2)
      if (!item?.checked) {
        priceCount.value -= price
        selectedGoodsCount.value -= 1
      } else {
        priceCount.value += price
        selectedGoodsCount.value += 1
      }
      const isAllCheck = cartListData.every((ele) => ele.checked)

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isAllCheck ? (allChecked.value = true) : (allChecked.value = false)
    }

    const goOrder = () => {
      console.log('去结算')
      // 结算逻辑
      router.push('/profile')
    }

    return () => (
      <div class={styles['shop-cart']}>
        {/* <Shortcut />
        <Header /> */}
        <div class={styles.goods}>
          <div class={styles['goods-num']}>全部商品&nbsp;&nbsp;{cartSumNums.value}</div>
          <table>
            <tr>
              <th>
                <input type="checkbox" checked={allChecked.value} onClick={checkedAll} />
                <span>全选</span>
              </th>
              <th>商品</th>
              <th></th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
              <th>操作</th>
            </tr>
            {cartListData.map((item, key) => (
              <tr key={key}>
                <td>
                  <input
                    type="checkbox"
                    checked={item?.checked}
                    onClick={() => changeChecked(item, key, !item.checked)}
                  />
                </td>
                <td>
                  <img src={item.goods.image} alt="" />
                </td>
                <td>{item.goods.name}</td>
                <td>￥{item.goods.p_price}</td>
                <td>
                  <NInputNumber
                    min={1}
                    max={10}
                    value={item.nums}
                    onChange={(v) => {
                      const check = cartListData[key].nums < v!
                      cartListData[key].nums = v as number
                      requestUpdateCart({
                        sku_id: item.sku_id,
                        nums: v!,
                      })
                      changeChecked(item, key, check)
                    }}
                  />
                </td>
                <td>￥{(Number(item.goods.p_price) * item.nums).toFixed(2)}</td>
                <td
                  onClick={() => {
                    requestDeleteCart({
                      sku_id: item.sku_id,
                    })
                    requestFindGoods()
                  }}
                >
                  删除
                </td>
              </tr>
            ))}
          </table>
          <div class={styles['bottom-tool']}>
            <div class={styles['tool-left']}>
              <input type="checkbox" checked={allChecked.value} onClick={checkedAll} />
              全选
              <span
                class={[styles['delete-selected'], 'cs']}
                //   onClick={() => deleteGoods(0)}
                // requestDeleteCart
              >
                删除选中商品
              </span>
              <span
                class={[styles['clear-cart'], 'cs']}
                //    onClick={() => deleteGoods(1)}
              >
                清理购物车 ({count.value})
              </span>
            </div>
            <div class={styles['tool-right']}>
              <span class={styles['selected-goods']}>
                已选择 <em>{selectedGoodsCount.value}</em>件商品
              </span>
              <span class={styles['price-count']}>
                总价: <em>￥{priceCount.value.toFixed(2)}</em>
              </span>
              <span class={styles['go-order']} onClick={goOrder}>
                去结算
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
