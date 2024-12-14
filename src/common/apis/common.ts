import { request } from "@/http/axios"

export function uploadFile<T>(files: { raw: File }[], data: Record<string, any> = {}): Promise<T> {
  const formData = new FormData()

  // 遍历文件数组并添加到 FormData
  files.forEach((file) => {
    formData.append(`file`, file.raw)
  })

  // data is extra params
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  return request({
    url: "/system/disabledUser/importData",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  })
}

export function downTemplate() {
  return request({
    headers: {
      // responseType: "arraybuffer"
      responseType: "blob" // 确保返回的数据是 Blob 类型
    },
    responseType: "blob",
    // responseType: "arraybuffer",
    url: "/system/disabledUser/downTemplate",
    method: "get"
  })
}
