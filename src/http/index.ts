import _ from 'lodash'
import { useLogin } from '@/store'
import { useRouter } from 'vue-router'

export const client = (url: string = '', method: string = 'GET', params?: unknown) => {
  const { setIsLogin, setUsername } = useLogin()
  const router = useRouter()
  const queryParams = new URLSearchParams(params as any)
  const reurl = method === 'GET' ? (_.isEmpty(queryParams) ? url : url + '?' + queryParams) : url
  const requestUrl =
    import.meta.env.MODE === 'production'
      ? `${import.meta.env.VITE_APP_BASE_URL}/${reurl}`
      : `http://localhost:8000/${reurl}`

  const token = window.localStorage.getItem('token')

  const headers: { [key: string]: string } = {
    Authorization: '',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = token
  }
  const body =
    method !== 'GET'
      ? {
          body: JSON.stringify(params),
        }
      : {}
  return fetch(requestUrl, {
    method: method,
    headers: headers,
    ...body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.status) {
        alert('登录失效 请重新登录')
        localStorage.removeItem('token')
        setIsLogin(false)
        setUsername('')
        router.push('/login')
      }
      return data
    })
    .catch(console.error)
}

type ResponseType = Promise<any>
class Request {
  public getData = (resultData: ResponseType, setData?: (res?: any) => void) => {
    resultData.then((res) => setData?.(res))
  }
  public get = <T = any>(url: string, param?: T) => client(url, 'GET', param)
  public post = <T = any>(url: string, param?: T) => client(url, 'POST', param)
  public put = <T = any>(url: string, param: T) => client(url, 'PUT', param)
  public delete = <T = any>(url: string, param: T) => client(url, 'DELETE', param)
}

export const request = new Request()
