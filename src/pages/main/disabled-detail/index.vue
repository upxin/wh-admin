<script lang="ts" setup>
import type { CreateOrUpdateTableRequestData, TableData } from "@@/apis/table/type"
import type { FormInstance, FormRules } from "element-plus"
import { deleteFile, downTemplate, getByBiz } from "@@/apis/common"
import { delPointRecord, pointRecord } from "@@/apis/main/disabled-detail/index"
import { createTableDataApi, deleteTableDataApi, getMan, getTableDataApi, updateTableDataApi } from "@@/apis/table"
import { usePagination } from "@@/composables/usePagination"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search, Upload } from "@element-plus/icons-vue"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})
const route = useRoute()

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region 删
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const { bizType } = route.query
    if (bizType === "pointRecord") {
      delPointRecord([row.id]).then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
      return
    }
    deleteFile(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
function delMultiple() {
  const createTimes = multipleSelection.value.map(item => item.createTime).join(",")
  const ids = multipleSelection.value.map(item => item.id)
  if (!ids.length) return ElMessage.error("请选择")
  ElMessageBox.confirm(`正在删除打卡记录：${createTimes}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delPointRecord(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const tableData = ref<TableData[]>([])
function getTableData() {
  const { bizType, bizId } = route.query
  if (bizType === "pointRecord") {
    pointRecord({
      userId: bizId,
      pageSize: paginationData.pageSize,
      pageNum: paginationData.currentPage
    }).then((res) => {
      tableData.value = res.rows
      paginationData.total = res.total
    })
    return
  }
  getByBiz({
    pageSize: paginationData.pageSize,
    pageNum: paginationData.currentPage,
    bizType,
    bizId
  }).then((res) => {
    tableData.value = res.data
    paginationData.total = res.total
  })
}
const multipleSelection = ref<TableData[]>([])
function handleSelectionChange(val: TableData[]) {
  multipleSelection.value = val
}

const titleMap = {
  task: "任务详情",
  pointRecord: "打卡记录",
  contract: "合同详情",
  pay: "薪酬详情"
}
function getFileType(url) {
  if (!url) return "image"

  const extension = url.split(".").pop().toLowerCase()

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"]

  if (imageExtensions.includes(extension)) {
    return "image"
  } else if (videoExtensions.includes(extension)) {
    return "video"
  }
}

const currentPointImage = ref("")
function look(row) {
  getByBiz({
    pageSize: 30,
    pageNum: 1,
    bizType: "pointRecord",
    bizId: row.id
  }).then((res) => {
    dialogVisible.value = true
    currentPointImage.value = res.data[0].url
  })
}
const dialogVisible = ref(false)
const type = computed(() => {
  return titleMap[route.query.bizType]
})
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div flex justify-between>
          <el-button type="danger" @click="delMultiple">
            批量删除
          </el-button>
          <el-button :icon="Refresh" @click="getTableData">
            刷新
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column :label="type">
            <template #default="scope">
              <el-image style="width: 100px;height: 100px;" v-if="getFileType(scope.row.url) === 'image'" :src="scope.row.url" :preview-src-list="[scope.row.url]" />
              <video v-else controls style="width: 400px;height: 260px;">
                <source :src="scope.row.url" type="video/mp4">
              </video>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
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
