import { defineComponent, onMounted, reactive, ref } from 'vue'

import { request } from '@/http'
import { useLogin } from '@/store'
import { URLS } from '@/requestUrls'
import { setList, setObj } from '@/utils'

import styles from './index.module.scss'
import {
  FormInst,
  FormItemRule,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
  useMessage,
  useModal,
} from 'naive-ui'

const { getData, post } = request

interface BasicInfo {
  id?: number
  email?: string
  birthday: string
  create_time?: null
  name: string
  mobile: string
  gender: string
}

interface RePassw {
  old_password?: string
  password?: string
  passwordre?: string
}

export default defineComponent({
  name: 'BasicInfo',
  setup(props, ctx) {
    const message = useMessage()
    const modal = useModal()
    const { username, isLogin } = useLogin()
    const userInfo = reactive<BasicInfo>({} as BasicInfo)

    const formRef = ref<FormInst | null>(null)
    const rePasswformRef = ref<FormInst | null>(null)
    const model = reactive<BasicInfo>({
      name: '',
      birthday: '',
      mobile: '',
      gender: '',
    })
    const modelrePassw = reactive<RePassw>({
      old_password: '',
      password: '',
      passwordre: '',
    })
    const rules = {
      name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入昵称',
      },
      birthday: {
        required: false,
        trigger: ['blur', 'input'],
        message: '请选择生日',
      },
      mobile: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入手机号',
      },
      gender: {
        required: false,
        trigger: ['blur', 'input'],
        message: '请选择性别',
      },
    }

    const rePasswRules = {
      old_password: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入原来密码',
      },
      password: {
        required: true,
        validator(rule: FormItemRule, value: string) {
          return value === modelrePassw.passwordre
        },
        trigger: ['blur', 'input'],
        message: '请输入新密码',
      },
      passwordre: {
        required: true,
        validator(rule: FormItemRule, value: string) {
          return value === modelrePassw.password
        },
        trigger: ['blur', 'input'],
        message: '请再次输入密码, ',
      },
    }
    const showCardPreset = () => {
      const m = modal.create({
        title: '修改用户信息',
        preset: 'card',
        style: {
          width: '600px',
        },
        content: () => (
          <NForm model={model} rules={rules} ref={formRef} labelPlacement="left" labelWidth={100}>
            <NFormItem label="昵称：" path="name">
              <NInput v-model:value={model.name} />
            </NFormItem>
            <NFormItem label="生日：" path="birthday">
              <NInput v-model:value={model.birthday} />
            </NFormItem>
            <NFormItem label="手机号：" path="mobile">
              <NInput v-model:value={model.mobile} />
            </NFormItem>
            <NFormItem label="性别：" path="gender">
              <NRadioGroup v-model:value={model.gender}>
                <NRadio value={'0'}>男</NRadio>
                <NRadio value={'1'}>女</NRadio>
              </NRadioGroup>
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
                      requestUpdateUserInfo(model)
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
    const showCardEditPassword = () => {
      const m = modal.create({
        title: '修改密码',
        preset: 'card',
        style: {
          width: '600px',
        },
        content: () => (
          <NForm
            model={modelrePassw}
            rules={rePasswRules}
            ref={formRef}
            labelPlacement="left"
            labelWidth={100}
          >
            <NFormItem label="旧密码" path="old_password">
              <NInput v-model:value={modelrePassw.old_password} />
            </NFormItem>
            <NFormItem label="新密码：" path="password">
              <NInput type="password" v-model:value={modelrePassw.password} />
            </NFormItem>
            <NFormItem label="新密码：" path="passwordre">
              <NInput type="password" v-model:value={modelrePassw.passwordre} />
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
                  rePasswformRef.value?.validate((error) => {
                    if (!error) {
                      message.success('验证成功')
                      const params = { ...modelrePassw }
                      delete params?.passwordre
                      requestUpdateUserInfo(params)
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
    const requestUserInfoData = () => {
      getData(
        post(URLS.user_info, {
          username: username,
        }),
        (res) => {
          setObj(userInfo, res?.data)
        },
      )
    }

    const requestUpdateUserInfo = (params: BasicInfo | RePassw) => {
      getData(
        post(URLS.user_update, {
          ...params,
          username: username,
        }),
        (res) => {
          if (res.status == 4000) {
            message.success('更新成功')
            requestUserInfoData()
            setObj(model, {} as BasicInfo)
          }
        },
      )
    }
    onMounted(() => {
      requestUserInfoData()
    })
    return () => (
      <div>
        <div
          style={{
            padding: '20px',
          }}
        >
          <NButton
            style={{ marginRight: '10px' }}
            onClick={() => {
              setObj(model, {
                name: userInfo.name,
                birthday: userInfo.birthday,
                mobile: userInfo.mobile,
                gender: userInfo.gender,
                id: userInfo.id,
              })
              showCardPreset()
            }}
          >
            编辑用户信息
          </NButton>
          <NButton
            onClick={() => {
              showCardEditPassword()
            }}
          >
            修改密码
          </NButton>
        </div>
        <div class={styles.basicInfo}>
          <p>
            <span class={styles.label}>昵称：</span>
            <span>{userInfo?.name || '-'}</span>
          </p>
          <p>
            <span class={styles.label}>生日：</span>
            <span>{userInfo?.birthday || '-'}</span>
          </p>
          <p>
            <span class={styles.label}>注册时间：</span>
            <span>{userInfo?.create_time || '-'}</span>
          </p>
          <p>
            <span class={styles.label}>手机：</span>
            <span>{userInfo?.mobile || '-'}</span>
          </p>
          <p>
            <span class={styles.label}>性别：</span>
            <span>{+userInfo?.gender == 0 ? '男' : '女'}</span>
          </p>
        </div>
      </div>
    )
  },
})
