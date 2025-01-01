import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPagination } from 'naive-ui'

import shopCart from '@/assets/images/cart/add-cart1.png'
import { useCartAdd } from '@/hooks/useAddCart'
import { useSearch } from '@/hooks/search'
import SearchInput from '../search'

import styles from './index.module.scss'

export default defineComponent({
  name: 'GoodsList',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const requestCartAdd = useCartAdd()
    const { searchData, page, keyword, total } = useSearch()

    const orderTypes = ref([
      { index: 1, order: 1, name: '综合', isActive: true },
      { index: 2, order: 1, name: '评论数', isActive: false },
      { index: 3, order: 2, name: '价格', isActive: false },
    ])
    const changeOrder = (currentOrder: number, index: number) => {
      // 点击完成之后，要进行页面刷新
      router.push('/goods_list/' + route.params.keyword + '/' + 1 + '/' + currentOrder)

      // 样式切换
      for (const i in orderTypes.value) {
        if (orderTypes.value[i].index == index) {
          orderTypes.value[i].isActive = true
        } else {
          orderTypes.value[i].isActive = false
        }
      }
    }

    return () => (
      <div class={styles.goodsList}>
        <SearchInput />
        <div class={styles['all-goods']}>
          <div>
            <span>全部商品分类</span>
          </div>
        </div>

        <div class={styles['all-goods-list']}>
          <div class={styles['result-keyword']}>
            <span class={styles['all-result-font']}>全部结果&nbsp;&nbsp;{'>'}&nbsp;&nbsp;</span>
            <span class={styles['search-word']}>{keyword.value}</span>
          </div>

          <div class={styles['goods-list']}>
            <div class={styles['search-condition']}>
              {orderTypes.value.map((ele, index) => {
                const cls = [
                  (() => {
                    if (ele.isActive) return styles['current-condition']
                    return styles['not-current-condition']
                  })(),
                ]
                return (
                  <a
                    href="#"
                    key={index}
                    class={cls}
                    onClick={() => {
                      changeOrder(ele.order, ele.index)
                    }}
                  >
                    <span>{ele.name}</span>
                    <img src="" alt="" />
                  </a>
                )
              })}
            </div>
          </div>

          <div class={[styles['list-detail'], 'clearfix']}>
            {searchData.map((ele, index) => {
              return (
                <div
                  key={index}
                  class={[styles['erery-goods'], 'fl']}
                  onClick={() => {
                    window.open('/detail/' + ele?.sku_id)
                  }}
                >
                  <div>
                    <img src={ele.image} class={styles['goods_image']} alt="" />
                  </div>
                  <div class={styles['price']}>￥{ele.p_price}</div>
                  <div class={[styles['name'], 'cs', 'dian2']}>{ele.name}</div>
                  <div class={styles['comment-count']}>
                    <span class={styles['count']}>{ele.comment_count ? ele.comment_count : 0}</span>
                    <span class={styles['comment']}>条评价</span>
                  </div>
                  <div class={styles['shop-name']}>{ele.shop_name}</div>
                  <div
                    class={[styles['add-cart'], 'cs']}
                    onClick={(e) => {
                      e.stopPropagation()
                      requestCartAdd({
                        sku_id: ele.sku_id,
                        nums: 1,
                      })
                    }}
                  >
                    <img src={shopCart} alt="" />
                    加入购物车
                  </div>
                </div>
              )
            })}
          </div>

          <div class={styles['change_page']}>
            <div class={styles['block']}>
              <span class={styles.demonstration}></span>
              <NPagination
                size="large"
                pageSize={15}
                page={page.value}
                pageCount={Math.ceil(total.value / 15)}
                onUpdatePage={(p) => {
                  router.push({
                    name: 'goodsList',
                    params: { ...route.params, page: p },
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
})
