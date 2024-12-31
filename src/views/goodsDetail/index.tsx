import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NInputNumber } from 'naive-ui'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setObj } from '@/utils'
import CommentView from '@/components/comment'
import { useCartAdd } from '@/hooks/useAddCart'

import styles from './index.module.scss'

const { getData, get } = request

type GoodsDetail = {
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
  find: number
}

export default defineComponent({
  name: 'GoodsDetail',
  setup(props, ctx) {
    const route = useRoute()
    const requestCartAdd = useCartAdd()
    const goodsDetail = reactive<GoodsDetail>({} as GoodsDetail)

    const requestFindGoods = () =>
      getData(get(URLS.goods_detail + route.params.sku_id), (res) => {
        setObj<GoodsDetail>(goodsDetail, res?.data)
      })

    onMounted(() => {
      requestFindGoods()
    })

    const nums = ref(1)
    return () => (
      <div class={styles.goodsDetail}>
        <div class={[styles.good, 'clearfix']}>
          <div class="fl">
            <img src={goodsDetail?.image} alt="" />
          </div>
          <div class={[styles['good-content'], 'fl']}>
            <div class={styles.desc}>{goodsDetail?.name}</div>
            <div class={styles.price}>{goodsDetail?.p_price}</div>
            <div class={styles.count}>
              <NInputNumber
                value={nums.value}
                min={1}
                max={10}
                onChange={(v) => {
                  nums.value = v as number
                }}
              />
            </div>
            <a
              href="#"
              class={styles['add-cart']}
              onClick={() => {
                requestCartAdd({
                  sku_id: goodsDetail.sku_id,
                  nums: nums.value,
                })
              }}
            >
              加入购物车
            </a>
          </div>
        </div>
        <div class={styles.comment}>
          <CommentView skuId={route.params.sku_id as string} />
        </div>
      </div>
    )
  },
})
