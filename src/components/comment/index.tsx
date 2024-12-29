import { defineComponent, onMounted, reactive, ref } from 'vue'
import { NPagination } from 'naive-ui'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList } from '@/utils'
import star from '@/assets/images/goods/star.png'

import styles from './index.module.scss'

const { getData, get } = request

interface goodsCommentDetail {
  id: number
  user_id: number
  sku_id: string
  content: string
  user_image_url: string
  reference_name: string
  score: number
  nickname: string
  reply_count: string
  create_time: string
}

export default defineComponent({
  name: 'CommentView',
  props: {
    skuId: String,
  },
  setup(props) {
    const page = ref(1)
    const count = ref(0)
    const goodsCommentDetailData = reactive<goodsCommentDetail[]>([])

    // 请求商品评论详情
    const requestGoodsCommentDetail = (page?: number) => {
      getData(
        get(URLS.comment_detail + '?sku_id=' + props?.skuId + '&page=' + (page || 1)),
        (res) => {
          setList<goodsCommentDetail>(goodsCommentDetailData, res?.data)
        },
      )
    }

    // 请求商品评论数量
    const requestGoodsCommentCount = () => {
      getData(get(URLS.comment_count + '?sku_id=' + props?.skuId), (res) => {
        count.value = res?.data
      })
    }

    // 组件挂载时请求数据
    onMounted(() => {
      requestGoodsCommentDetail()
      requestGoodsCommentCount()
    })

    return () => (
      <div class={styles.comment}>
        {goodsCommentDetailData.map((item, index) => (
          <div class={styles.detail} key={index}>
            <div class={'clearfix'}>
              <div class={[styles.left, 'fl']}>
                <div class={styles['header-content']}>
                  <img src={`http://${item.user_image_url}`} alt="" />
                  <span class={styles.nickName}>{item.nickname}</span>
                </div>
              </div>
              <div class={[styles.right, 'fl']}>
                <div class={styles.star}>
                  {[...Array(item.score)].map((_, i) => (
                    <img key={i} src={star} alt="" />
                  ))}
                  {[...Array(5 - item.score)].map((_, i) => (
                    <img key={i} src={star} alt="" />
                  ))}
                </div>
                <div class={styles.text}>{item.content}</div>
                <div class={styles.time}>
                  {item.create_time.replace('T', ' ').replace('Z', ' ')}
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}

        <div class={styles['change_page']}>
          <div class={styles.block}>
            <span class={styles.demonstration}></span>
            <NPagination
              size="large"
              pageSize={15}
              page={page.value}
              onUpdatePage={(p) => {
                page.value = p
                requestGoodsCommentDetail(p)
              }}
              pageCount={Math.ceil(count.value / 15)}
            />
          </div>
        </div>
      </div>
    )
  },
})
