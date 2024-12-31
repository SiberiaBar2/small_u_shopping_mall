import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList, toParse } from '@/utils'

const { getData, get } = request

type SearchKeys = Record<'page' | 'order', number> & {
  keyword: string
}
export interface Search {
  comment_count: number
  image: string
  name: string
  p_price: number
  shop_name: string
  sku_id: string
}
export const useSearch = () => {
  const route = useRoute()

  const searchData = reactive<Search[]>([])
  const total = ref(0)

  const keyword = computed(() => {
    return route.params.keyword as string
  })
  const page = computed(() => {
    return +route.params.page as number
  })
  const order = computed(() => {
    return +route.params.order as number
  })

  const requestSearchData = (param: SearchKeys) => {
    const { keyword, page, order } = param
    getData(get(URLS.goods_search + keyword + '/' + page + '/' + order), (res) => {
      setList<Search>(searchData, toParse(res?.data))
    })
  }
  const requestSearchKeyWordCount = (param: Pick<SearchKeys, 'keyword'>) => {
    const { keyword } = param
    getData(get(URLS.goods_keyword_count + '/' + keyword), (res) => {
      total.value = res?.data
    })
  }

  onMounted(() => {
    requestSearchData({ keyword: keyword.value, page: page.value, order: order.value })
    requestSearchKeyWordCount({ keyword: keyword.value })
  })
  watchEffect(() => {
    requestSearchData({ keyword: keyword.value, page: page.value, order: order.value })
  })
  return {
    page,
    order,
    total,
    keyword,
    searchData,
    requestSearchData,
  }
}
