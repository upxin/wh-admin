import { createAlova } from 'alova'
import { useUserStore } from '@/pinia/stores/user'
import { getToken } from '@@/utils/cache/cookies'
import { ElMessage } from 'element-plus'

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStore().logout()
  location.reload()
}

/** 创建请求实例 */
export const Alova= createAlova({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  beforeRequest(method) {
    // 假设我们需要添加token到请求头
    method.config.headers.token = 'token';
  },
  errorAdapter: (error) => {
    const status = error.response?.status
    switch (status) {
      case 400:
        error.msg = '请求错误'
        break
      case 401:
        logout()
        break
      case 403:
        error.msg = '拒绝访问'
        break
      case 404:
        error.msg = '请求地址出错'
        break
      case 408:
        error.msg = '请求超时'
        break
      case 500:
        error.msg = '服务器内部错误'
        break
      case 501:
        error.msg = '服务未实现'
        break
      case 502:
        error.msg = '网关错误'
        break
      case 503:
        error.msg = '服务不可用'
        break
      case 504:
        error.msg = '网关超时'
        break
      case 505:
        error.msg = 'HTTP 版本不受支持'
        break
      default:
        error.msg = '未知错误'
    }
    ElMessage.error(error.msg)
    throw error
  }
})
