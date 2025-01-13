import { request } from "@/http/axios"

export function backCompany(id: string) {
  return request<any>({
    url: "/system/disabledUser/backCompany",
    method: "get",
    params: { id }
  })
}

export function companyNew(data) {
  return request<any>({
    url: "/system/disabledUser/companyNew",
    method: "put",
    data
  })
}
