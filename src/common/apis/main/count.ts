import { request } from "@/http/axios"

export function selectTask(params: any) {
  return request({
    url: "/system/disabledUser/selectTask",
    params,
    method: "get"
  })
}

export function getTask(params: any) {
  return request({
    url: "/system/disabledUser/selectTask",
    params,
    method: "get",
    responseType: "blob"
  })
}
