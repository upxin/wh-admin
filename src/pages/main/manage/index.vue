<script lang="ts" setup>
import type { CreateOrUpdateTableRequestData, TableData } from "@@/apis/table/type"
import type { FormInstance, FormRules } from "element-plus"
import { createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi } from "@@/apis/table"
import { usePagination } from "@@/composables/usePagination"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search, Upload } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import { uploadFile, downTemplate } from '@@/apis/common'

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()


const fileList = ref([])
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>({
  id: '',
  company: '',
  idCard: '',
  phonenumber: '',
  pointAddress: '',
  sex: '',
  userName: '',
  disabledCard: '',
  employmentDate: ''
})
const formRules: FormRules<TableData> = {
  userName: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  phonenumber: [{ required: true, trigger: "blur", message: "请输入手机" }],
  idCard: [{ required: true, trigger: "blur", message: "请输入身份证" }],
  pointAddress: [{ required: true, trigger: "blur", message: "请输入打卡地址" }],
}
function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    const api = !formData.value.id ? createTableDataApi : updateTableDataApi
    api(formData.value).then(() => {
      ElMessage.success("操作成功")
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
    employmentDate: '',
    id: '',
    company: '',
    idCard: '',
    phonenumber: '',
    pointAddress: '',
    sex: '',
    userName: '',
    disabledCard: ''
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
function delMultiple() {
  const names = multipleSelection.value.map(item => item.userName).join(',')
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
// #endregion

// #region 改
function handleUpdate(row: TableData) {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
// #endregion

// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  userName: "",
  phonenumber: ""
})
function getTableData() {
  loading.value = true
  const opts = {
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
  }
  if (searchData.userName) {
    Reflect.set(opts, 'userName', searchData.userName)
  }
  if (searchData.phonenumber) {
    Reflect.set(opts, 'phonenumber', searchData.phonenumber)
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
// #endregion
function customUpload() {
  uploadFile(fileList.value).finally(() => {
    fileList.value = []
  })
}
function handleAdd() {
  dialogVisible.value = true
  resetForm()
}
// 解析导出的二进制文件流
async function downloadExcel() {
  try {
    const response = await downTemplate()
    console.log(response)
    // 创建一个 URL 对象
    const url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
    const link = document.createElement('a')
    link.href = url

    // 设置下载文件名
    link.setAttribute('download', '模板.xlsx')

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 移除链接
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting Excel file:', error)
  }
}
const multipleSelection = ref<TableData[]>([])
const handleSelectionChange = (val: TableData[]) => {
  multipleSelection.value = val
}
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" label-position="right">
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phonenumber" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="searchData.userName" placeholder="请输入" clearable />
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
      <div class="toolbar-wrapper">
        <div flex>
          <el-upload v-model:file-list="fileList" action="" multiple :limit="3" :http-request="customUpload"
            class="mr-10px" accept=".xlsx,.xls">
            <el-button type="primary">批量导入</el-button>
          </el-upload>
          <el-button type="primary" @click="handleAdd">
            新增用户
          </el-button>

          <el-button type="primary" @click="downloadExcel">
            模板下载
          </el-button>

          <el-button type="danger" @click="delMultiple">
            批量删除
          </el-button>

        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="userName" label="用户名" width="100" />
          <el-table-column prop="sex" label="性别" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.sex === '0'" type="primary" effect="plain" disable-transitions>
                女
              </el-tag>
              <el-tag v-else type="warning" effect="plain" disable-transitions>
                男
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" width="150" />
          <el-table-column prop="pointAddress" label="打卡地址" width="220" />
          <el-table-column prop="idCard" label="身份证" width="200"></el-table-column>
          <el-table-column prop="disabledCard" label="残疾人证" width="200" />
          <el-table-column prop="employmentDate" label="入职时间" width="150" />
          <!-- <el-table-column prop="createTime" label="创建时间"  width="200" /> -->
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">
                修改
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination background :layout="paginationData.layout" :page-sizes="paginationData.pageSizes"
          :total="paginationData.total" :page-size="paginationData.pageSize" :current-page="paginationData.currentPage"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog v-model="dialogVisible" :title="!formData.id ? '新增用户' : '修改用户'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="formData.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="idCard" label="身份证">
          <el-input v-model="formData.idCard" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item prop="disabledCard" label="残疾人证">
          <el-input v-model="formData.disabledCard" placeholder="请输入残疾人证" />
        </el-form-item>
        <el-form-item prop="phonenumber" label="手机号">
          <el-input v-model="formData.phonenumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="pointAddress" label="打卡地址">
          <el-input v-model="formData.pointAddress" placeholder="请输入打卡地址" />
        </el-form-item>
        <el-form-item prop="company" label="公司">
          <el-input v-model="formData.company" placeholder="请输入公司" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio value="1">男</el-radio>
            <el-radio value="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="employmentDate" label="入职时间">
          <el-date-picker v-model="formData.employmentDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="请选择入职时间"/>
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
