import { request } from "@/http/axios"

/** 增 */
export function userCount(data: { year: string }) {
  return request({
    url: "/system/disabledUser/userCount",
    method: "post",
    data
  })
}
