export interface CreateOrUpdateTableRequestData {
  company: string
  idCard: string
  phonenumber: string
  pointAddress: string
  sex: string
  userName: string
  id: string
}

export interface TableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：手机号 */
  phonenumber?: string
  userName?: string
}

export interface TableData {
  company: string
  createTime: string
  id: string
  idCard: string
  phonenumber: string
  pointAddress: string
  sex: string
  userName: string
  updateTime: string
}

export type TableResponseData = {
  rows: TableData[]
  total: number
}
