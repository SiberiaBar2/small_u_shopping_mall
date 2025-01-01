import { defineComponent, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { NCarousel } from 'naive-ui'
import _ from 'lodash'

import HomeHeader from './header'
import SearchInput from './search'
import { useHome } from '@/hooks/home'
import findGoods from '@/assets/images/find-goods.png'
import whiteArrow from '@/assets/images/menu/arrows-white.png'

import banner1 from '@/assets/images/banner/banner1.png'
import banner2 from '@/assets/images/banner/banner2.png'
import banner3 from '@/assets/images/banner/banner3.png'
import banner4 from '@/assets/images/banner/banner4.png'
import banner5 from '@/assets/images/banner/banner5.png'
import banner6 from '@/assets/images/banner/banner6.png'

import styles from './home.module.scss'

export default defineComponent({
  components: {
    Vue3SeamlessScroll,
  },
  setup(props, ctx) {
    const images = ref([banner1, banner2, banner3, banner4, banner5, banner6])
    const {
      mainMenu,
      goodsFind,
      goodsCategory,
      requestSubMenu,
      showSubMenuData,
      requestGoodsCategory,
    } = useHome()
    const isShow = ref<boolean>(false)

    const renderMainMenu = () => (
      <div class={styles.centerMenu}>
        <div class={styles.mainMenu}>
          {mainMenu.map((ele) => {
            return (
              <span
                key={ele?.main_menu_id}
                class={styles.item}
                onMousemove={_.debounce((e) => {
                  requestSubMenu({
                    main_menu_id: ele?.main_menu_id,
                  })
                  e.stopPropagation()
                  isShow.value = true
                }, 200)}
              >
                {ele?.main_menu_name}
              </span>
            )
          })}
        </div>
        <div class={styles.background}>
          <NCarousel autoplay trigger="hover">
            {images.value.map((ele, index) => {
              return <img src={ele} alt="" key={index} />
            })}
          </NCarousel>
          {
            <ul
              class={styles.menuContent}
              style={{
                display: isShow.value ? 'block' : 'none',
              }}
              onMouseleave={() => {
                isShow.value = false
              }}
            >
              {showSubMenuData.value.map((item, index) => {
                return (
                  <li key={index}>
                    <div class={styles.tagList}>
                      {item.data.map((ele: any, i) => {
                        if (ele.type === 'channel')
                          return (
                            <div class={[styles.tag, 'cs']} key={ele.key}>
                              <span>{ele.name}</span>
                              <img src={whiteArrow} alt="" />
                            </div>
                          )
                        return null
                      })}
                    </div>
                    <div class={styles.menuLine}>
                      {item.data.map((ele: any, i) => {
                        if (ele.type === 'dt')
                          return (
                            <span class={styles.menuItemTitle} key={ele.key}>
                              {ele.name} {'>'}
                            </span>
                          )
                        return null
                      })}
                      <div>
                        {item.data.map((ele: any, i) => {
                          if (ele.type === 'dd')
                            return (
                              <span class={styles.menuItem} key={ele.key}>
                                {ele.name}
                              </span>
                            )
                          return null
                        })}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          }
        </div>
      </div>
    )

    const toGoodsDetail = (skuId: string) => {
      window.open('/detail/' + skuId)
    }
    // const list = ref(toRaw(goodsFind))
    const renderGoodsFind = () => (
      <div class={styles.findGoods}>
        <div class={styles.findGoodsImgWrap}>
          <img src={findGoods} alt="find_goods.png" />
        </div>
        {/* <Vue3SeamlessScroll class={styles.scroll} list={list.value} direction="left">
          {list.value.map((ele, index) => {
            return (
              <div class={styles.item} key={index}>
                {ele?.title}
                {ele?.date}
              </div>
            )
          })}
        </Vue3SeamlessScroll> */}

        {/* {console.log('goodsFind', goodsFind.value, list.value)} */}
        <Vue3SeamlessScroll
          class={styles.scroll}
          list={goodsFind}
          direction="left"
          singleLine
          hover
          v-slots={{
            default: () => {
              return goodsFind.map((ele, index) => {
                if (index % 2 === 0)
                  return (
                    <div
                      class={styles.item}
                      key={index}
                      title={ele?.name}
                      onClick={() => toGoodsDetail(ele?.sku_id)}
                    >
                      <span class="dian1">{ele?.name}</span>
                      <img src={ele.image} alt="" />
                    </div>
                  )
                else {
                  return (
                    <div
                      class={styles.item}
                      key={index}
                      title={ele?.name}
                      onClick={() => toGoodsDetail(ele?.sku_id)}
                    >
                      <img src={ele.image} alt="" />
                      <span class="dian1">{ele?.name}</span>
                    </div>
                  )
                }
              })
            },
          }}
        />
      </div>
    )

    const category = ref([
      { typeId: 1, title: '精选', content: '猜你喜欢', selected: true },
      { typeId: 2, title: '智能先锋', content: '大电器城', selected: false },
      { typeId: 3, title: '居家优品', content: '品质生活', selected: false },
      { typeId: 4, title: '超市百货', content: '百货生鲜', selected: false },
      { typeId: 5, title: '时尚达人', content: '美妆穿搭', selected: false },
      { typeId: 6, title: '进口好物', content: '京东国际', selected: false },
    ])
    const categoryId = ref(1)
    watchEffect(() => {
      requestGoodsCategory({
        category_id: categoryId.value,
        page: 1,
      })
    })
    const toCategory = (typeId: number) => {
      categoryId.value = typeId
      for (const i in category.value) {
        category.value[i].selected = false
        if (typeId == parseInt(i) + 1) {
          category.value[i].selected = true
        }
      }
    }
    const page = ref<number>(1)
    const windowScroll = () => {
      // 可视区域的高度，就是我们用眼睛能看见的内容的高度
      const clientHeight = document.documentElement.clientHeight
      // 滚动条在文档中的高度的位置（滚出可见区域的高度）
      const scrollTop = document.documentElement.scrollTop
      // 所有内容的高度
      const scrollHeight = document.body.scrollHeight

      if (clientHeight + scrollTop >= scrollHeight) {
        page.value += 1
        requestGoodsCategory(
          {
            category_id: categoryId.value,
            page: page.value,
          },
          true,
        )
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', windowScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', windowScroll)
    })

    return () => (
      <div>
        <div>
          <HomeHeader />
          <div
            class={styles.center}
            onMouseleave={() => {
              isShow.value = false
            }}
          >
            <SearchInput />

            {renderMainMenu()}

            {renderGoodsFind()}

            <div class={[styles.category, styles.clearfix]}>
              {category.value.map((ele, index) => {
                const cls = [
                  styles['category-title'],
                  (() => {
                    if (ele.selected) return styles['selected_title']
                    return ''
                  })(),
                ]
                const cls1 = [
                  styles['category-content'],
                  (() => {
                    if (ele.selected) return styles['selected_content']
                    return ''
                  })(),
                ]
                return (
                  <div class={[styles.content]} onClick={() => toCategory(ele.typeId)}>
                    <div class={cls}>{ele.title}</div>
                    <div class={cls1}>{ele.content}</div>
                  </div>
                )
              })}
            </div>
            <div class={styles.categoryContent}>
              {goodsCategory.map((ele, index) => {
                return (
                  <div
                    class={[styles.goods, 'fl', 'clearfix']}
                    key={index}
                    onClick={() => {
                      toGoodsDetail(ele.sku_id)
                    }}
                  >
                    <div class={styles['first-row']}>
                      <img src={ele.image} alt="" />
                    </div>
                    <div class={[styles['second-row'], 'dian2']}>{ele?.name}</div>
                    <div class={styles['third-row']}>
                      <small>￥</small>
                      <span>{ele?.jd_price}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  },
})
