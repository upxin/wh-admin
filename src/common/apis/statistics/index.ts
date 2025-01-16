import { request } from "@/http/axios"

/** 增 */
export function userCount(data: {
  company: string
  endDate: string
  startDate: string
}) {
  return request({
    url: "/system/disabledUser/userCount",
    method: "post",
    data
  })
}
