<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import type { LoginRequestData } from "./apis/type"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useUserStore } from "@/pinia/stores/user"
import ThemeSwitch from "@@/components/ThemeSwitch/index.vue"
import { Key, Loading, Lock, Picture, User } from "@element-plus/icons-vue"
import { loginApi } from "./apis"
import Owl from "./components/Owl.vue"
import { useFocus } from "./composables/useFocus"

const router = useRouter()

const userStore = useUserStore()

const settingsStore = useSettingsStore()

const { isFocus, handleBlur, handleFocus } = useFocus()

/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)


/** 登录表单数据 */
const loginFormData: LoginRequestData = reactive({
  "username": "",
  "tenantCode": "enjoy",
  "password": ""
})

/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
}

/** 登录 */
function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    loginApi(loginFormData).then(({ data }) => {
      userStore.setToken(data.access_token)
      router.push("/")
    }).catch(() => {
    }).finally(() => {
      loading.value = false
    })
  })
}


</script>

<template>
  <div class="login-container">
    <div class="absolute z-1 size-full overflow-hidden">
      <div class="absolute -right-300px -top-900px lt-sm:-right-100px lt-sm:-top-1170px">
        <svg height="1337" width="1337">
          <defs>
            <path id="path-1" opacity="1" fill-rule="evenodd"
              d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z">
            </path>
            <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
              <stop offset="0" stop-color="#dee3ff" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#646cff" stop-opacity="1"></stop>
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1"></use>
          </g>
        </svg>
      </div>
      <div class="absolute -bottom-400px -left-200px lt-sm:-bottom-760px lt-sm:-left-100px">
        <svg height="896" width="967.8852157128662">
          <defs>
            <path id="path-2" opacity="1" fill-rule="evenodd"
              d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z">
            </path>
            <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stop-color="#646cff" stop-opacity="1"></stop>
              <stop offset="1" stop-color="#dee3ff" stop-opacity="1"></stop>
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1"></use>
          </g>
        </svg>
      </div>
    </div>
    <ThemeSwitch v-if="settingsStore.showThemeSwitch" class="theme-switch" />
    <Owl :close-eyes="isFocus" />
    <div class="login-card">
      <div class="title">
        大美科技
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input v-model.trim="loginFormData.username" placeholder="用户名" type="text" tabindex="1"
              :prefix-icon="User" size="large" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model.trim="loginFormData.password" placeholder="密码" type="password" tabindex="2"
              :prefix-icon="Lock" size="large" show-password @blur="handleBlur" @focus="handleFocus" />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">
            登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;

  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }

  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    position: relative;
    z-index: 100;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      font-size: 30px;

      img {
        height: 100%;
      }
    }

    .content {
      padding: 20px 50px 50px 50px;

      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;

        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }

      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
