<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { addUser, delUser, getUser, listUser, updateUser } from "@@/apis/user/index"
import { usePagination } from "@@/composables/usePagination"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search, Upload } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"

interface TableData {
  userName: string
  deptId: string //  ---枚举值{1:大美科技}
  loginName: string// ---登录名
  password: string// ---密码
  status: "0"// ---固定值
  postIds: any[]
  userId: string
  roleIds: number[]// ---角色枚举值
}
defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const roleList = [
  {
    label: "超级管理员",
    value: 1
  },
  {
    label: "残疾人员",
    value: 1864328227351810050
  }
]
const depList = [{ label: "大美科技", value: 1 }]

const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive<TableData>({
  userName: "",
  deptId: "",
  loginName: "",
  postIds: [],
  roleIds: [],
  password: "123456",
  status: "0",
  userId: ""
})
const formRules: FormRules<TableData> = {
  userName: [{ required: true, trigger: "blur", message: "请输入用户名" }]
}
function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    const api = !formData.userId ? addUser : updateUser
    api(formData).then(() => {
      ElMessage.success("操作成功")
      dialogVisible.value = false
      getUserList()
    }).finally(() => {
      loading.value = false
    })
  })
}
function resetForm() {
  formRef.value?.clearValidate()
  formData.userName = ""
  formData.deptId = ""
  formData.loginName = ""
  formData.postIds = []
  formData.roleIds = []
  formData.password = "123456"
  formData.status = "0"
  formData.userId = ""
}
// #endregion

// #region 删
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`正在删除用户：${row.userName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delUser([row.userId]).then(() => {
      ElMessage.success("删除成功")
      getUserList()
    })
  })
}
function delMultiple() {
  const names = multipleSelection.value.map(item => item.userName).join(",")
  const ids = multipleSelection.value.map(item => item.userId)
  if (!ids.length) return ElMessage.warning("请选择数据")
  ElMessageBox.confirm(`正在删除用户：${names}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delUser(ids).then(() => {
      ElMessage.success("删除成功")
      getUserList()
    })
  })
}
// #endregion

// #region 改
function handleUpdate(row: TableData) {
  dialogVisible.value = true
  for (const key in formData) {
    formData[key] = row[key]
  }
}
// #endregion

// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  userName: "",
  role: ""
})
function getUserList() {
  loading.value = true
  const opts = {
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize
  }
  if (searchData.userName) {
    Reflect.set(opts, "userName", searchData.userName)
  }
  if (searchData.role) {
    Reflect.set(opts, "role", searchData.role)
  }

  listUser(opts).then((res) => {
    paginationData.total = res.total
    tableData.value = res.rows
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}
function handleSearch() {
  paginationData.currentPage === 1 ? getUserList() : (paginationData.currentPage = 1)
}
function resetSearch() {
  searchFormRef.value?.resetFields()
  handleSearch()
}
function handleAdd() {
  dialogVisible.value = true
  resetForm()
}
const multipleSelection = ref<TableData[]>([])
function handleSelectionChange(val: TableData[]) {
  multipleSelection.value = val
}
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUserList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <!-- <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.role" placeholder="请输入" clearable />
        </el-form-item> -->
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
            <el-button type="primary" :icon="RefreshRight" circle @click="getUserList" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="userName" label="用户名" width="280" />
          <el-table-column prop="loginName" label="登录名" width="180" />
          <el-table-column prop="roleName" label="角色" />
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
              <el-button :text="true" type="primary" @click="handleUpdate(scope.row)">
                修改
              </el-button>
              <el-button :text="true" type="danger" @click="handleDelete(scope.row)">
                删除
              </el-button>
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
    <el-dialog v-model="dialogVisible" :title="!formData.userId ? '新增用户' : '修改用户'" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="formData.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="loginName" label="登录名">
          <el-input v-model="formData.loginName" placeholder="请输入登录名" />
        </el-form-item>
        <!-- <el-form-item prop="password" label="初始密码">
          <el-input v-model="formData.password" placeholder="请输入初始密码" />
        </el-form-item> -->
        <el-form-item prop="roleIds" label="角色">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择角色" style="width: 100%;">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="归属部门">
          <el-select v-model="formData.deptId" size="large" style="width: 100%" placeholder="请选择部门">
            <el-option v-for="item in depList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
