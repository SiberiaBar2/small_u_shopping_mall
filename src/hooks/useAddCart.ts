import { useMessage } from 'naive-ui'

import { request } from '@/http'
import { URLS } from '@/requestUrls'

const { getData, post } = request

type P = { sku_id: string; nums: number }

export const useCartAdd = () => {
  const message = useMessage()
  const requestCartAdd = ({ sku_id, nums }: P) => {
    getData(
      post(URLS.cart_add, {
        sku_id: sku_id,
        nums: nums,
      }),
      (res) => {
        if (res.status === 3000) {
          message.success('添加购物车成功')
        }
      },
    )
  }
  return requestCartAdd
}