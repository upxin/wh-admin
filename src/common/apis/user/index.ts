import type * as Login from "./type"
import { request } from "@/http/axios"


// 获取用户详细信息
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: '/system/saas/user/getInfo',
    method: 'get'
  })
}
