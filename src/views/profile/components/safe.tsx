import { defineComponent, onMounted, reactive } from 'vue'
import { request } from '@/http'
import { useLogin } from '@/store'
import { URLS } from '@/requestUrls'
import { setObj } from '@/utils'

const { getData, post } = request

import styles from './index.module.scss'

export default defineComponent({
  name: 'SafeView',
  setup(props, ctx) {
    return () => (
      <div>
        <address>SafeView</address>
      </div>
    )
  },
})
