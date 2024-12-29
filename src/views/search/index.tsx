import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import styles from './index.module.scss'

export default defineComponent({
  name: 'SearchInput',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const hotWords = ref([
      { word: '电脑', active: true },
      { word: '手机', active: false },
      { word: '裙子', active: false },
      { word: '空调', active: false },
      { word: '男装', active: false },
      { word: '女装', active: false },
      { word: '食品', active: false },
      { word: '百货', active: false },
      { word: '家具', active: false },
      { word: '酒类', active: false },
      { word: '户外', active: false },
      { word: '玩具', active: false },
      { word: '办公', active: false },
      { word: '箱包', active: false },
      { word: '运动', active: false },
    ])

    const search = (keyword: string) => {
      router.push('/goods_list/' + (keyword || '1') + '/1/1')
      hotWords.value.forEach((d) => {
        if (d.word == keyword) {
          d.active = true
        } else {
          d.active = false
        }
      })
    }
    const searchValue = ref('')
    watchEffect(() => {
      hotWords.value.forEach((d) => {
        if (d.word == route.params.keyword) {
          d.active = true
        } else {
          d.active = false
        }
      })
    })
    return () => (
      <div class={styles.main}>
        <div class={styles.content}>
          <input
            value={searchValue.value}
            onInput={(e) => {
              searchValue.value = e.target.value
            }}
            class={styles.text}
            placeholder={'秘密'}
          />
          <span
            class={'iconfont icon-fangdajing'}
            onClick={() => {
              search(searchValue.value)
            }}
          />
        </div>
        <div class={styles.hotword}>
          {hotWords.value.map((ele, index) => {
            const cls = [
              styles.hotwordItem,
              (() => {
                if (ele.active) return styles.active
                return ''
              })(),
            ]
            return (
              <a href="#" class={cls} key={ele.word} onClick={() => search(ele.word)}>
                {ele.word}
              </a>
            )
          })}
        </div>
      </div>
    )
  },
})
