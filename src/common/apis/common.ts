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

export function getByBiz(params: any) {
  return request({
    url: "/file/file/getByBizPage",
    params,
    method: "get"
  })
}

export function deleteFile(id: string) {
  return request({
    url: `/file/file/${id}`,
    method: "delete"
  })
}

export function getBizIds(disabledUserId: string) {
  return request({
    url: `/system/disabledUser/getBizIds`,
    method: "get",
    params: { disabledUserId }
  })
}

export function downloadZipByBiz(data: any) {
  return request({
    url: `/file/file/downloadZipByBiz`,
    method: "post",
    data,
    responseType: "blob"
  })
}

export function downloadZip(blobData, fileName = "download.zip") {
  return new Promise((rv) => {
    // 创建一个 Blob 对象
    const blob = new Blob([blobData], { type: "application/zip" })

    // 创建一个 URL 对象
    const url = URL.createObjectURL(blob)

    // 创建一个 <a> 标签进行下载
    const a = document.createElement("a")
    a.href = url
    a.download = fileName

    // 触发下载
    document.body.appendChild(a)
    a.click()

    // 清理资源
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    rv(true)
  })
}
