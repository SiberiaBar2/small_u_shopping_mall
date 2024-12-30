import { defineComponent, onMounted, reactive, ref } from 'vue'
import { request } from '@/http'
import { useLogin } from '@/store'
import { URLS } from '@/requestUrls'
import { setObj, setList } from '@/utils'

import deletePng from '@/assets/images/profile/delete.png'

const { getData, post, get } = request

import styles from './index.module.scss'

export interface OrderInfo {
  trade_no: string
  email: string
  order_amount: string
  address_id: null
  pay_status: string
  pay_time: null
  ali_trade_no: null
  is_delete: number
  create_time: Date
  order_goods: OrderGood[]
}

export interface OrderGood {
  id: number
  trade_no: string
  sku_id: string
  goods_num: number | null
  create_time: Date
  p_price: string
  image: string
  name: string
  shop_name: string
}
export default defineComponent({
  name: 'OrderView',
  setup(props, ctx) {
    const { username } = useLogin()

    const orderInfo = reactive<OrderInfo[]>([])
    const requestOrderData = (pay_status = -1) => {
      getData(
        get(URLS.order_info + `?pay_status=${pay_status}`, {
          username: username,
        }),
        (res) => {
          console.log('rererereee', res)
          setList(orderInfo, res?.data)
        },
      )
    }
    onMounted(() => {
      requestOrderData()
    })

    // 筛选条件的变量
    const orderStatusDict = ref([
      {
        payStatus: -1,
        payName: '全部订单',
        isActive: true,
      },
      {
        payStatus: 0,
        payName: '待确认',
        isActive: false,
      },
      {
        payStatus: 1,
        payName: '待付款',
        isActive: false,
      },
      {
        payStatus: 2,
        payName: '待收货',
        isActive: false,
      },
      {
        payStatus: 3,
        payName: '已完成',
        isActive: false,
      },
    ])
    const changeOrderStatus = (ordeStatus: number) => {
      orderStatusDict.value.forEach((element) => {
        if (element.payStatus == ordeStatus) {
          requestOrderData(ordeStatus)
          element.isActive = true
        } else {
          element.isActive = false
        }
      })
    }

    const switchStatus = (payStatus: number) => {
      const orderStatus: Record<number, string[]> = {
        0: ['待确认', '确认订单'],
        1: ['待付款', '支付订单'],
        2: ['待收货', '确认收货'],
        3: ['已完成', '再次购买'],
      }
      return orderStatus[payStatus]
    }
    return () => (
      <div class={styles.order}>
        <div class={styles.condition}>
          {orderStatusDict.value.map((item, index) => (
            <span
              key={index}
              onClick={() => changeOrderStatus(item.payStatus)}
              class={item.isActive ? `${styles['is-active']}` : ''}
            >
              {item.payName}
            </span>
          ))}
        </div>
        <table>
          <tr class={styles['table-header']}>
            <th>订单详情</th>
            <th>收货人</th>
            <th>金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          {orderInfo.map((item) => (
            <tbody class={styles['order-info']} key={item.trade_no}>
              <tr class={styles['blank-tr']}></tr>
              <tr class={styles['info-header']}>
                <td class={styles['order-num']}>
                  <span>{item.create_time}</span>
                  <span>订单号:</span>
                  <b>{item.trade_no}</b>
                </td>
                <td colspan="4" class={styles['img-td']}>
                  {/* <el-popconfirm
                      width="220"
                      confirmButtonText="删除"
                      cancelButtonText="不,谢谢"
                      title="确认删除这个订单吗"
                      onConfirm={() => deleteOrder(item.trade_no)}
                    > */}
                  <img src={deletePng} alt="" />
                </td>
              </tr>
              {item.order_goods.map((data, key) => (
                <tr class={styles['info-detail']} key={key}>
                  <td class={[styles['goods-detail'], 'clearfix']}>
                    <a href={`/detail/${data.sku_id}`} target="_blank">
                      <img src={data.image} alt="" class={'fl'} />
                      <div class={'fl'}>
                        <span class={'dian2'} title={data.name}>
                          {data.name}
                        </span>
                      </div>
                    </a>
                    <div class={[styles['goods-num'], 'fl']}>x{data.goods_num}</div>
                  </td>
                  {key < 1 && (
                    <>
                      <td rowspan={item.order_goods.length}>大周老师</td>
                      <td rowspan={item.order_goods.length}>{item.order_amount}</td>
                      <td rowspan={item.order_goods.length}>{switchStatus(+item.pay_status)[0]}</td>
                      <td rowspan={item.order_goods.length}>
                        <span
                          class={styles['order-action']}
                          // onClick={() =>
                          //   toAction(item.pay_status, item.trade_no, item.order_amount, item.order_info)
                          // }
                        >
                          {switchStatus(+item.pay_status)[1]}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    )
  },
})
