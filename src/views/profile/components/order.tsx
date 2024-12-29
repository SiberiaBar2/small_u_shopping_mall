import { defineComponent, onMounted, reactive } from 'vue'
import { BasicInfo } from '..'
import { request } from '@/http'
import { useLogin } from '@/store'
import { URLS } from '@/requestUrls'
import { setObj } from '@/utils'

const { getData, post } = request

import styles from './index.module.scss'

export default defineComponent({
  name: 'OrderView',
  setup(props, ctx) {
    return () => (
      <div>
        <address>OrderView</address>
      </div>
    )
  },
})
