import type * as Table from "./type"
import { request } from "@/http/axios"

/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: "/system/disabledUser/addDisabledUser",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(ids: string[]) {
  return request({
    url: `/system/disabledUser/ids?ids=${ids.join(",")}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: "/system/disabledUser/updateDisabledUser",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.TableRequestData) {
  return request<Table.TableResponseData>({
    url: "/system/disabledUser/selectPage",
    method: "get",
    params
  })
}

export function getMan(params) {
  return request<Blob>({
    headers: {
      // responseType: "arraybuffer"
      responseType: "blob" // 确保返回的数据是 Blob 类型
    },
    responseType: "blob",
    url: "/system/disabledUser/selectPage",
    method: "get",
    params
  })
}

export function disabledUserLeave(id: string) {
  return request<any>({
    url: "/system/disabledUser/leave",
    method: "get",
    params: { id }
  })
}
