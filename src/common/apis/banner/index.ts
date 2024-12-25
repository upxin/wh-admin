import { request } from "@/http/axios"

export function uploadBannerFile<T>(
  files: { raw: File }[],
  data: Record<string, any> = {
    bizId: "banner",
    bizType: "banner"
  }
): Promise<T> {
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
    url: "/file/file/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  })
}
