import { request } from "@/http/axios"

export function getByBiz(params: any) {
  return request({
    url: "/file/file/getByBiz",
    params,
    method: "get"
  })
}

export function pointRecord(params: any) {
  return request({
    url: "/system/pointRecord/selectPage",
    params,
    method: "get"
  })
}
export function delPointRecord(ids: string[]) {
  return request({
    url: `/system/pointRecord/ids?ids=${ids.join(",")}`,
    method: "delete"
  })
}
