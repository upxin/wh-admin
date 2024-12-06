<template>
  <section class="h-screen w-screen flex flex-col justify-center p-30rpx box-border items-center">
    <wd-loading size="50px" v-if="!hasLogin"/>
    <wd-form ref="form" :model="model" v-else="hasLogin">
      <wd-card custom-class="st-sha">
        <wd-cell-group border>
          <wd-input label="用户名" label-width="110rpx" prop="value1" clearable v-model="model.value1" placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <wd-input label="密码" label-width="110rpx" prop="value2" show-password clearable v-model="model.value2"
            placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        </wd-cell-group>
      </wd-card>
      <view class="p-40px">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </section>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: ''
})
const hasLogin = ref(true)
const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
      }
      console.log(valid)
      uni.switchTab({
        url:'/pages/index/index'
      })
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>
<style>
.login {
  width: 670rpx;
  border-radius: 20rpx;
  background-color: #fff;
}

.gra {
  background-image: linear-gradient(to bottom, #c3c7d4, #e7e6ea);
}

.st-sha {
  box-shadow: 0px 0px 5px #ddd !important;
}
</style>
