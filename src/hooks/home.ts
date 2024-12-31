import { computed, onMounted, reactive } from 'vue'

import { request } from '@/http'
import { URLS } from '@/requestUrls'
import { setList, toParse } from '@/utils'

const { getData, get } = request

type SubMenu = { main_menu_id: string }
type MenuKeys = Record<'name' | 'type' | 'key', string>
type MenuRes = {
  index: string
  data: MenuKeys[]
}
type ResultSubMenu = Record<
  'sub_menu_name' | 'sub_menu_type' | 'sub_menu_id' | 'sub_menu_url' | 'main_menu_id',
  string
>
type ResultMainMenu = ResultSubMenu &
  Record<'main_menu_id' | 'main_menu_url' | 'main_menu_name', string>

interface GoosFind {
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

type Category = { category_id: number; page: number }

export interface CategoryResult {
  type_id: number
  name: string
  sku_id: string
  target_url: string
  jd_price: number
  p_price: number
  shop_name: string
  shop_id: number
  spu_id: string
  mk_price: number
  vender_id: number
  find: number
  create_time: null
  image: string
}

const INITCATEGORYPARAM = {
  category_id: 1,
  page: 1,
}

export const useHome = () => {
  const subMenu = reactive<ResultSubMenu[]>([])
  const mainMenu = reactive<ResultMainMenu[]>([])
  const goodsFind = reactive<GoosFind[]>([])
  const goodsCategory = reactive<CategoryResult[]>([])

  const requestSubMenu = (param: SubMenu) =>
    getData(get(URLS.sub_menu, param), (res) => setList(subMenu, res?.data))
  const requestMainMenu = () => getData(get(URLS.main_menu), (res) => setList(mainMenu, res?.data))
  const requestFindGoods = () =>
    getData(get(URLS.goods_find), (res) => {
      setList(goodsFind, res?.data)
    })
  const requestGoodsCategory = (param: Category = INITCATEGORYPARAM, push = false) =>
    getData(get(URLS.goods_category + param.category_id + '/' + param.page), (res) => {
      //   if (res?.data?.length > 0 && push) setList(goodsCategory, toJson(res?.data), push)
      //   if (res?.data?.length === 0 && push) return
      //   else
      setList(goodsCategory, toParse(res?.data), push)
      //   goodsCategory.push(...toJson(res?.data))
    })

  const showSubMenuData = computed(() => {
    const resultList = []
    let result: MenuRes = { index: '', data: [] }
    for (const i in subMenu) {
      const id = subMenu[i].sub_menu_id
      const data: MenuKeys = {
        name: subMenu[i].sub_menu_name,
        type: subMenu[i].sub_menu_type,
        key: subMenu[i].sub_menu_id,
      }
      if (result['index'] != null && id == result['index']) {
        result['data'].push(data)
      } else {
        result = { index: '', data: [] }
        result['index'] = id
        result['data'].push(data)
        resultList.push(result)
      }
    }
    return resultList
  })

  onMounted(() => {
    requestMainMenu()
    requestFindGoods()
    requestGoodsCategory()
  })

  return {
    mainMenu,
    goodsFind,
    goodsCategory,
    requestSubMenu,
    showSubMenuData,
    requestGoodsCategory,
  }
}

class SubMenuValue {
  private submenu = {} as Record<string, ResultSubMenu[]>

  public setSubmenu = (key: string, value: ResultSubMenu[]) => {
    this.submenu[key] = value
  }

  public ishaveKey = (key: string) => {
    if (this.submenu[key] && this.submenu[key].length > 0) {
      return true
    }
    return false
  }

  public getSubmenuValue = (key: string) => {
    return this.submenu[key]
  }
}

export const submenuValue = new SubMenuValue()
