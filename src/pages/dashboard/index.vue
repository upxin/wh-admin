<script lang="ts" setup>
import { useUserStore } from "@/pinia/stores/user"
import { uploadBannerFile } from "@@/apis/banner/index"
import { deleteFile, getByBiz } from "@@/apis/common"

const userStore = useUserStore()
const isAdmin = userStore.roles.includes("admin")
const tableData = ref([])
const loading = ref(false)
const fileList = ref([])
function customUpload() {
  uploadBannerFile(fileList.value).then((res) => {
    fileList.value = []
  })
}
function handleDelete(row) {
  ElMessageBox.confirm(`确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteFile(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

function getTableData() {
  getByBiz({
    pageSize: 30,
    pageNum: 1,
    bizType: "banner",
    bizId: "banner"
  }).then((res) => {
    tableData.value = res.data
  })
}
onBeforeMount(() => {
  getTableData()
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <el-upload
          style="width: 140px;"
          v-model:file-list="fileList" action="" multiple :limit="3" :http-request="customUpload" class="mr-10px"
          accept=".jpg,.png,.jpge,.webp"
        >
          <el-button type="primary">
            新增
          </el-button>
        </el-upload>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" height="650">
          <el-table-column label="图片">
            <template #default="scope">
              <el-image :src="scope.row.url" style="width: 100px; height: 100px" fit="fill" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
