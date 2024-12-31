import { defineComponent, onMounted, reactive, ref } from 'vue'
import {
  useModal,
  NButton,
  NForm,
  NFormItem,
  NInput,
  FormInst,
  useMessage,
  NSwitch,
  NTag,
} from 'naive-ui'

import { request } from '@/http'
import { useLogin } from '@/store'
import { URLS } from '@/requestUrls'
import { setList, setObj } from '@/utils'

import styles from './index.module.scss'

const { getData, post } = request

export interface Address {
  id?: number
  email?: string
  signer_name: string
  telphone: string
  signer_address: string
  district: string
  default?: number | boolean
  create_time?: string
}

const rules = {
  signer_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入收货人名称',
  },
  district: {
    required: false,
    trigger: ['blur', 'input'],
    message: '请输入当前位置',
  },
  signer_address: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入收货地址',
  },
  telphone: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入手机号码',
  },
}

export default defineComponent({
  name: 'AddressView',
  setup(props, ctx) {
    const message = useMessage()
    const modal = useModal()
    const type = ref('')
    const { username } = useLogin()
    const formRef = ref<FormInst | null>(null)
    const address = reactive<Address[]>([])
    const model = reactive<Address>({
      signer_name: '',
      district: '',
      signer_address: '',
      telphone: '',
      default: false,
    })

    const showCardPreset = () => {
      const m = modal.create({
        title: `${type.value}地址`,
        preset: 'card',
        style: {
          width: '600px',
        },
        content: () => (
          <NForm model={model} rules={rules} ref={formRef} labelPlacement="left" labelWidth={100}>
            <NFormItem label="昵称：" path="signer_name">
              <NInput
                v-model:value={model.signer_name}
                onChange={(e) => {
                  console.log('signer_address', e)
                }}
              />
            </NFormItem>
            <NFormItem label="所在位置：" path="district">
              <NInput v-model:value={model.district} />
            </NFormItem>
            <NFormItem label="收货地址：" path="signer_address">
              <NInput v-model:value={model.signer_address} />
            </NFormItem>
            <NFormItem label="手机：" path="telphone">
              <NInput v-model:value={model.telphone} />
            </NFormItem>
            <NFormItem label="默认地址：" path="default">
              <NSwitch v-model:value={model.default} />
            </NFormItem>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >
              <NButton
                type="primary"
                style={{
                  marginLeft: '10px',
                }}
                onClick={() => {
                  formRef.value?.validate((error) => {
                    if (!error) {
                      message.success('验证成功')
                      if (type.value == '编辑') requestUpdateAddress(model)
                      else {
                        const params = { ...model }
                        delete params?.id
                        requestAddAddress(model)
                      }
                      m.destroy()
                    } else {
                      console.log(error)
                      message.error('验证失败')
                    }
                  })
                }}
              >
                提交
              </NButton>
              <NButton
                onClick={() => {
                  m.destroy()
                }}
              >
                取消
              </NButton>
            </div>
          </NForm>
        ),
      })
    }
    const requestAddressData = () => {
      getData(
        post(URLS.address_list, {
          username: username,
        }),
        (res) => {
          setList(address, res?.data)
        },
      )
    }
    const requestUpdateAddress = (params: Address) => {
      getData(
        post(URLS.address_update, {
          ...params,
          username: username,
          default: params.default ? 1 : 0,
        }),
        (res) => {
          if (res.status == 6000) {
            message.success('更新成功')
            requestAddressData()
          }
        },
      )
    }
    const requestAddAddress = (params: Address) => {
      getData(
        post(URLS.address_add, {
          ...params,
          username: username,
          default: params.default ? 1 : 0,
        }),
        (res) => {
          if (res.status == 6000) {
            message.success('新增成功')
            requestAddressData()
          }
        },
      )
    }
    const requestDeleteAddress = (id: number) => {
      getData(
        post(URLS.address_delete, {
          id: id,
        }),
        (res) => {
          if (res.status == 6000) {
            message.success('删除成功')
            requestAddressData()
          }
        },
      )
    }
    onMounted(() => {
      requestAddressData()
    })
    return () => (
      <div>
        <div
          style={{
            margin: '20px',
          }}
        >
          <NButton
            type="primary"
            onClick={() => {
              setObj(model, {} as Address)
              type.value = '新增'
              showCardPreset()
            }}
          >
            新增地址
          </NButton>
        </div>
        {address.map((ele, index) => {
          return (
            <div key={ele.id} class={styles.address}>
              <div class={styles.field}>
                <label class={styles.label}>姓名:</label>
                <p>{ele.signer_name || '-'}</p>
              </div>
              <div class={styles.field}>
                <label class={styles.label}>电话:</label>
                <p>{ele.telphone || '-'}</p>
              </div>
              <div class={styles.field}>
                <label class={styles.label}>收货地址:</label>
                <p>{ele.signer_address || '-'}</p>
              </div>
              <div class={styles.field}>
                <label class={styles.label}>所在地区:</label>
                <p>{ele.district || '-'}</p>
              </div>
              <div class={styles.field}>
                <label class={styles.label}>地址创建时间:</label>
                <p>{ele.create_time || '-'}</p>
              </div>
              <div class={styles.field}>
                {ele.default ? (
                  <>
                    <label
                      class={styles.label}
                      style={{
                        opacity: 0,
                      }}
                    >
                      默认地址:
                    </label>
                    {ele.default ? <NTag type="success">默认地址</NTag> : null}
                  </>
                ) : null}
              </div>
              <div class={styles.editButtonWrapper}>
                <button
                  class={styles.deleteButton}
                  onClick={() => {
                    setObj(model, {
                      ...ele,
                      default: ele.default == 1 ? true : false,
                    })
                    type.value = '编辑'
                    showCardPreset()
                  }}
                >
                  编辑
                </button>
              </div>
              <div class={styles.deleteButtonWrapper}>
                <button
                  class={styles.deleteButton}
                  onClick={() => {
                    const m = modal.create({
                      title: '确认删除？',
                      preset: 'card',
                      style: {
                        width: '400px',
                      },
                      content: () => {
                        return (
                          <div>
                            <p>您确定要删除吗？</p>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                              }}
                            >
                              <NButton
                                type="primary"
                                style={{
                                  marginLeft: '10px',
                                }}
                                onClick={() => {
                                  requestDeleteAddress(ele?.id!)
                                  m.destroy()
                                }}
                              >
                                确认
                              </NButton>
                              <NButton
                                onClick={() => {
                                  m.destroy()
                                }}
                              >
                                取消
                              </NButton>
                            </div>
                          </div>
                        )
                      },
                    })
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
})
