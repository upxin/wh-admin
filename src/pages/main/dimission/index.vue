<script lang="ts" setup>
import type { CreateOrUpdateTableRequestData, TableData } from "@@/apis/table/type"
import type { FormInstance, FormRules } from "element-plus"
import { downTemplate, uploadFile } from "@@/apis/common"
import { backCompany, companyNew } from "@@/apis/dimission/index"
import { createTableDataApi, deleteTableDataApi, disabledUserLeave, getMan, getTableDataApi, updateTableDataApi } from "@@/apis/table"
import { usePagination } from "@@/composables/usePagination"
import { ArrowDown, Refresh, Search } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})
const router = useRouter()
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const fileList = ref([])
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>({
  id: "",
  company: "",
  idCard: "",
  phonenumber: "",
  userName: "",
  disabledCard: "",
  employmentDate: ""
})
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  userName: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  phonenumber: [{ required: true, trigger: "blur", message: "请输入手机" }],
  idCard: [{ required: true, trigger: "blur", message: "请输入身份证号码" }],
  disabledCard: [{ required: true, trigger: "blur", message: "请输入残疾证号码" }],
  employmentDate: [{ required: true, trigger: "blur", message: "请输入职时间" }],
  company: [{ required: true, trigger: "blur", message: "请输入所属公司" }]
}
function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    companyNew(formData.value).then(() => {
      ElMessage.success("入职新公司成功")
      dialogVisible.value = false
      getTableData()
    }).finally(() => {
      loading.value = false
    })
  })
}
function resetForm() {
  formRef.value?.clearValidate()
  formData.value = {
    employmentDate: "",
    id: "",
    company: "",
    idCard: "",
    phonenumber: "",
    userName: "",
    disabledCard: ""
  }
}
// #endregion

// #region 删
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`正在删除用户：${row.userName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi([row.id]).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
function _backCompany(row: TableData) {
  ElMessageBox.confirm(`确认继续录用该职工吗：${row.userName}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    backCompany(row.id).then(() => {
      ElMessage.success("录用成功")
      getTableData()
    })
  })
}
function delMultiple() {
  const names = multipleSelection.value.map(item => item.userName).join(",")
  const ids = multipleSelection.value.map(item => item.id)

  ElMessageBox.confirm(`正在删除用户：${names}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

function update(row: TableData) {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
let orderBy = {}
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  userName: "",
  company: "",
  phonenumber: ""
})
function getTableData() {
  loading.value = true
  const opts = {
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    status: "1" // 已经离职
  }
  if (searchData.userName) {
    Reflect.set(opts, "userName", searchData.userName)
  }
  if (searchData.phonenumber) {
    Reflect.set(opts, "phonenumber", searchData.phonenumber)
  }
  if (searchData.company) {
    Reflect.set(opts, "company", searchData.company)
  }

  if (orderBy) {
    Object.assign(opts, orderBy)
  }

  getTableDataApi(opts).then((res) => {
    console.log(res, 12345)
    paginationData.total = res.total
    tableData.value = res.rows
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}
function handleSearch() {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
function resetSearch() {
  searchFormRef.value?.resetFields()
  handleSearch()
}
function customUpload() {
  uploadFile(fileList.value).finally(() => {
    fileList.value = []
  })
}
function newCompany(row: TableData) {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
  formData.value.company = ""
  formData.value.employmentDate = ""
}
async function getExcel(response: Blob) {
  try {
    // 创建一个 URL 对象
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement("a")
    link.href = url

    // 设置下载文件名
    link.setAttribute("download", "模板.xlsx")

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 移除链接
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting Excel file:", error)
  }
}
// 解析导出的二进制文件流
async function downloadExcel() {
  const response = await downTemplate() as Blob
  console.log("downloadExcel====", response)

  getExcel(response)
}
async function exportExcel() {
  const opts = {
    exportFlag: 1,
    pageNum: 1,
    pageSize: 30000
  }
  getMan(opts).then((res) => {
    console.log("getTableDataApi====", res)
    getExcel(res)
  })
}
const multipleSelection = ref<TableData[]>([])
function handleSelectionChange(val: TableData[]) {
  multipleSelection.value = val
}
function handleDetail(row, bizType) {
  const { id: bizId, phonenumber } = row
  router.push({
    path: "/main/disabled-detail",
    query: {
      bizType,
      bizId,
      phonenumber
    }
  })
}
function camelToSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase()
}

function removeLastSixChars(str: string) {
  if (str.length <= 6) {
    return "" // 如果字符串长度小于或等于6，返回空字符串
  }
  return str.slice(0, -6)
}
function sortChange({ prop, order }: { prop: string, order: string }) {
  orderBy = { orderBy: `${camelToSnakeCase(prop)} ${removeLastSixChars(order)}` }
  getTableData()
}
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" label-position="right">
        <el-form-item prop="phonenumber" label="手机号">
          <el-input v-model="searchData.phonenumber" placeholder="请输入" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item prop="userName" label="姓名">
          <el-input v-model="searchData.userName" placeholder="请输入" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item prop="userName" label="所属公司">
          <el-input v-model="searchData.company" placeholder="请输入" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="userName" label="姓名" width="90" />
          <el-table-column prop="phonenumber" label="手机号" width="120" />
          <el-table-column prop="idCard" label="身份证号码" width="180" />
          <el-table-column prop="disabledCard" label="残疾证号码" width="200" />
          <el-table-column prop="employmentDate" label="入职时间" width="110" sortable="custom" />
          <el-table-column prop="leaveDate" label="离职时间" width="110" sortable="custom" />
          <el-table-column prop="company" label="所属公司" sortable="custom" width="400">
            <template #default="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.company" placement="top">
                <span class="inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis">{{ scope.row.company }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="渠道" width="210" sortable="custom" show-overflow-tooltip />

          <el-table-column />

          <el-table-column fixed="right" label="操作" width="340">
            <template #default="scope">
              <section class="flex items-center">
                <el-button :text="true" type="success" @click="_backCompany(scope.row)">
                  继续录用
                </el-button>
                <el-button :text="true" type="primary" @click="newCompany(scope.row)" style="margin-right: 12px;">
                  入职新公司
                </el-button>
                <el-popover placement="bottom" :width="110" trigger="click">
                  <template #default>
                    <div style="display: flex;align-items: center;flex-direction: column;">
                      <el-button
                        type="primary" :text="true" @click="handleDetail(scope.row, 'pointRecord')"
                        style="margin: 0;display: block;"
                      >
                        打卡记录
                      </el-button>
                      <el-button
                        type="primary" :text="true" @click="handleDetail(scope.row, 'task')"
                        style="margin: 0;display: block;"
                      >
                        任务详情
                      </el-button>
                      <el-button
                        type="primary" :text="true" @click="handleDetail(scope.row, 'contract')"
                        style="margin: 0;display: block;"
                      >
                        合同详情
                      </el-button>
                      <el-button
                        type="primary" :text="true" @click="handleDetail(scope.row, 'pay')"
                        style="margin: 0;display: block;"
                      >
                        薪酬详情
                      </el-button>
                    </div>
                  </template>
                  <template #reference>
                    <span class="flex items-center cursor-pointer">
                      <span style="color: #fe9739;"> 更多 </span>
                      <el-icon class="el-icon--right" color="#fe9739">
                        <ArrowDown />
                      </el-icon>
                    </span>
                  </template>
                </el-popover>
              </section>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background :layout="paginationData.layout" :page-sizes="paginationData.pageSizes"
          :total="paginationData.total" :page-size="paginationData.pageSize" :current-page="paginationData.currentPage"
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/修改 -->
    <el-dialog v-model="dialogVisible" title="信息录入" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item prop="userName" label="姓名">
          <el-input v-model="formData.userName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="phonenumber" label="手机号">
          <el-input v-model="formData.phonenumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号码">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item prop="disabledCard" label="残疾证号码">
          <el-input v-model="formData.disabledCard" placeholder="请输入残疾证号码" />
        </el-form-item>
        <el-form-item prop="employmentDate" label="入职时间">
          <el-date-picker
            style="width: 100%;" v-model="formData.employmentDate" type="date" value-format="YYYY-MM-DD"
            format="YYYY-MM-DD" placeholder="请选择入职时间"
          />
        </el-form-item>
        <el-form-item prop="company" label="所属公司">
          <el-input v-model="formData.company" placeholder="请输入所属公司" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleCreateOrUpdate">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
