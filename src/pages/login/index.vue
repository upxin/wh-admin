<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import type { LoginRequestData } from "./apis/type"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useUserStore } from "@/pinia/stores/user"
import logo from "@@/assets/images/layouts/logo.png?url"
import ThemeSwitch from "@@/components/ThemeSwitch/index.vue"
import { HomeFilled, Key, Loading, Lock, Picture, User } from "@element-plus/icons-vue"
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
  username: "",
  tenantCode: "enjoy",
  password: ""
})

/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ]
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
            <path
              id="path-1" opacity="1" fill-rule="evenodd"
              d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"
            />
            <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
              <stop offset="0" stop-color="#dee3ff" stop-opacity="1" />
              <stop offset="1" stop-color="#646cff" stop-opacity="1" />
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1" />
          </g>
        </svg>
      </div>
      <div class="absolute -bottom-400px -left-200px lt-sm:-bottom-760px lt-sm:-left-100px">
        <svg height="896" width="967.8852157128662">
          <defs>
            <path
              id="path-2" opacity="1" fill-rule="evenodd"
              d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z"
            />
            <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stop-color="#646cff" stop-opacity="1" />
              <stop offset="1" stop-color="#dee3ff" stop-opacity="1" />
            </linearGradient>
          </defs>
          <g opacity="1">
            <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1" />
          </g>
        </svg>
      </div>
    </div>
    <ThemeSwitch v-if="settingsStore.showThemeSwitch" class="theme-switch" />
    <svg
      class="svg-canvas" viewBox="89.84992852187122 -44.12369347830948 620.3000506594549 620.3000506594549"
      width="120" height="120" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs />

      <g id="shape_Vp1EUSXLO8" ref="shape_Vp1EUSXLO8" key="shape_Vp1EUSXLO8" mask="">
        <g
          transform="translate(132.04539372788,60) rotate(0,267.95460627212,118.12016003694) scale(1,1)"
          style="opacity: 1;mix-blend-mode: undefined;" filter=""
        >
          <!-- 普通元素 -->
          <svg
            version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" width="535.90921254424" height="236.24032007389"
            viewBox="2.3000030517578125 1.5400009155273438 195.68008422851562 86.25999450683594"
            style="enable-background:new 0 0 200 90;" xml:space="preserve" class="style-removed"
            preserveAspectRatio="none" data-parent="shape_Vp1EUSXLO8"
          >

            <g>
              <circle cx="72.14" cy="21.75" r="20.21" fill="#DB1D5B" stroke-width="0" />
              <circle cx="128.06" cy="21.75" r="20.21" fill="#0093F1" stroke-width="0" />
            </g>
            <path
              d="M96.23,55.57c-26.79-0.53-52.25-6.51-75.29-16.9c-1.31-0.57-2.6-1.18-3.89-1.8c-0.95-0.26-1.93-0.39-2.96-0.39
	c-6.52,0-11.79,5.28-11.79,11.78c0,3.35,1.4,6.39,3.64,8.53c0.83,0.62,1.68,1.24,2.53,1.85c0,0,0.02,0.02,0.03,0.02
	c24.86,17.71,55.07,28.35,87.72,29.14V55.57z" fill="#DB1D5B" stroke-width="0"
            />
            <path
              d="M186.21,36.48c-1.08,0-2.14,0.15-3.14,0.42l-0.02,0.02c-1.14,0.56-2.32,1.09-3.48,1.6
	c-0.02,0-0.02,0.02-0.03,0.02c-22.96,10.42-48.33,16.42-75.03,17.02v32.21c32.36-0.89,62.3-11.45,86.98-28.97
	c0.02,0,0.02,0,0.03-0.02c1.05-0.74,2.07-1.5,3.1-2.27c0,0,0.02,0,0.03-0.02c2.06-2.12,3.33-5.01,3.33-8.23
	C198,41.75,192.72,36.48,186.21,36.48z" fill="#0093F1" stroke-width="0"
            />
          </svg>
        </g>
      </g>
      <g id="shape_cRbIR4MXFu" ref="shape_cRbIR4MXFu" key="shape_cRbIR4MXFu" mask="">
        <g
          transform="translate(-222.19789155883007,-142.60929166567007) rotate(0,615.71195677313,537.21195677313) scale(1,1)"
          style="opacity: 1;mix-blend-mode: undefined;" filter=""
        >
          <!-- 普通元素 -->
          <svg
            xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="1231.42391354626" height="1074.42391354626" viewBox="0 0 1231.42391354626 1074.42391354626"
            data-ligature="true" data-parent="shape_cRbIR4MXFu"
          >
            <g
              data-role="text" data-width="307.14" data-height="153"
              transform="translate(462.14195677313006, 460.71195677313005)"
            >
              <path
                d="M148.81-77.09L148.81-68.49L92.76-68.49L133.61 13.21Q134.07 14.13 134.99 14.59Q135.91 15.05 136.98 15.36L136.98 15.36L148.81 17.35L148.81 25.95L117.63 20.73Q115.02 20.27 112.72 18.97Q110.42 17.66 109.19 15.36L109.19 15.36L76.78-48.99L44.38 15.36Q43.15 17.66 40.85 18.97Q38.55 20.27 35.94 20.73L35.94 20.73L4.76 25.95L4.76 17.35L16.59 15.36Q17.66 15.05 18.58 14.59Q19.50 14.13 19.96 13.21L19.96 13.21L60.81-68.49L4.76-68.49L4.76-77.09L64.65-77.09L64.65-118.10L88.92-118.10L88.92-77.09L148.81-77.09Z"
                transform="translate(0 128) " fill="rgb(219, 29, 91)" stroke="rgb(219, 29, 91)" stroke-width="0.256"
                data-glyph-w="153.57" data-glyph-h="160.78778999999997" data-glyph-ascender="131.91663"
                data-glyph-descender="-28.871159999999996" data-kerning="0"
              />
              <path
                d="M88.92-46.69L148.81-46.69L148.81-38.09L4.76-38.09L4.76-46.69L64.65-46.69L64.65-66.19L12.44-66.19L12.44-74.79L64.65-74.79L64.65-94.29L7.83-94.29L7.83-102.89L35.94-102.89L29.02-118.10L53.29-118.10L60.20-102.89L93.37-102.89L100.28-118.10L124.55-118.10L117.63-102.89L145.74-102.89L145.74-94.29L88.92-94.29L88.92-74.79L141.13-74.79L141.13-66.19L88.92-66.19L88.92-46.69ZM97.21-10.90L134.07 14.44Q134.68 14.74 135.30 14.90Q135.91 15.05 136.52 15.20L136.52 15.20L148.81 17.35L148.81 25.95L113.03 21.19Q109.19 20.73 106.27 18.74L106.27 18.74L76.78-2.76L47.30 18.74Q44.38 20.73 40.54 21.19L40.54 21.19L4.76 25.95L4.76 17.35L17.05 15.20Q17.66 15.05 18.27 14.90Q18.89 14.74 19.50 14.44L19.50 14.44L56.36-10.90L9.67-10.90L9.67-19.50L64.65-19.50L64.65-33.79L88.92-33.79L88.92-19.50L143.90-19.50L143.90-10.90L97.21-10.90Z"
                transform="translate(153.57 128) " fill="rgb(219, 29, 91)" stroke="rgb(219, 29, 91)"
                stroke-width="0.256" data-glyph-w="153.57" data-glyph-h="160.78778999999997"
                data-glyph-ascender="131.91663" data-glyph-descender="-28.871159999999996" data-kerning="0"
              />
            </g>
          </svg>
        </g>
      </g>
    </svg>
    <div class="login-card">
      <div class="title flex items-center">
        <span>大美科技</span>
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="tenantCode">
            <el-input
              v-model.trim="loginFormData.tenantCode" placeholder="租户" type="text" tabindex="1"
              :prefix-icon="HomeFilled" size="large"
            />
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username" placeholder="用户名" type="text" tabindex="1"
              :prefix-icon="User" size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password" placeholder="密码" type="password" tabindex="2"
              :prefix-icon="Lock" size="large" show-password @blur="handleBlur" @focus="handleFocus"
            />
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
