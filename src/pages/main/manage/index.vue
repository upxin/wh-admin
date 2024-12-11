<script lang="ts" setup>
import type { CreateOrUpdateTableRequestData, TableData } from "@@/apis/table/type"
import type { FormInstance, FormRules } from "element-plus"
import { createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi } from "@@/apis/table"
import { usePagination } from "@@/composables/usePagination"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search , Upload } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import { uploadFile } from '@@/apis/common'

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
})
const formRules: FormRules<TableData> = {
  userName: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  phonenumber: [{ required: true, trigger: "blur", message: "请输入手机" }],
  idCard: [{ required: true, trigger: "blur", message: "请输入身份证" }],
  pointAddress: [{ required: true, trigger: "blur", message: "请输入地址" }],
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
    id:'',
    company: '',
    idCard: '',
    phonenumber: '',
    pointAddress: '',
    sex: '',
    userName: '',
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
  const names = multipleSelection.value.map(item=> item.userName).join(',')
  const ids = multipleSelection.value.map(item=> item.id)

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
  if( searchData.userName) {
    Reflect.set(opts,'userName',searchData.userName)
  }
  if( searchData.phonenumber) {
    Reflect.set(opts,'phonenumber',searchData.phonenumber)
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
function handleAdd(){
  dialogVisible.value = true
  resetForm()
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
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phonenumber" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="searchData.userName" placeholder="请输入" clearable/>
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
            <el-button type="primary" :icon="Upload">批量导入</el-button>
          </el-upload>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
            新增用户
          </el-button> 
          <el-button type="danger" :icon="Delete" @click="delMultiple">
            批量删除
          </el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column prop="sex" label="性别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.sex === '0'" type="primary" effect="plain" disable-transitions>
                女
              </el-tag>
              <el-tag v-else type="warning" effect="plain" disable-transitions>
                男
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phonenumber" label="手机号" align="center" />
          <el-table-column prop="pointAddress" label="地址" align="center" />
          <el-table-column prop="idCard" label="身份证" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
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
    <el-dialog v-model="dialogVisible" :title="!formData.id ? '新增用户' : '修改用户'" width="500px"
      @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="formData.userName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="idCard" label="身份证">
          <el-input v-model="formData.idCard" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phonenumber" label="手机号">
          <el-input v-model="formData.phonenumber" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="pointAddress" label="地址">
          <el-input v-model="formData.pointAddress" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="company" label="公司">
          <el-input v-model="formData.company" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio value="1">男</el-radio>
            <el-radio value="0">女</el-radio>
          </el-radio-group>
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
