<template>
  <section class="py-40rpx">
    <wd-card title="考勤打卡" custom-class="border border-solid border-primary">
      通过小程序远程进行岗位考勤打卡
      <template #footer>
        <wd-button size="small" custom-class="mr-20rpx">上班打卡</wd-button>
        <wd-button size="small" type="success">下班打卡</wd-button>
      </template>
    </wd-card>
    <wd-card title="工作任务" custom-class="border border-solid border-primary">
      任务发布和完成
      <template #footer>
        <wd-button size="small" custom-class="mr-20rpx" @tap="upload(1)">上传任务</wd-button>
        <wd-button size="small" type="success" @tap="view(1)">查看任务</wd-button>
      </template>
    </wd-card>
    <wd-card title="合同视频" custom-class="border border-solid border-primary">
      入职人员签署劳动合同过程
      <template #footer>
        <wd-button size="small" custom-class="mr-20rpx" @tap="upload(2)">上传资料</wd-button>
        <wd-button size="small" type="success" @tap="view(2)">查看资料</wd-button>
      </template>
    </wd-card>
    <wd-card title="工资视频" custom-class="border border-solid border-primary">
      入职人员工资确认
      <template #footer>
        <wd-button size="small" custom-class="mr-20rpx" @tap="upload(3)">上传资料</wd-button>
        <wd-button size="small" type="success" @tap="view(3)">查看资料</wd-button>
      </template>
    </wd-card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
function upload(type) {
  wx.chooseMedia({
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    mediaType: ['mix'],
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有 //'camera'
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    }
  })
}
</script>
