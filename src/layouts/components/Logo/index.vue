<script lang="ts" setup>
import logo from "@@/assets/images/layouts/logo.png?url"
import { useLayoutMode } from "@@/composables/useLayoutMode"

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const { isLeft, isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ 'collapse': props.collapse, 'layout-mode-top': isTop }">
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <div class="flex items-center justify-center h-full">
          <img :src="logo" class="w-40px h-40px rounded-full">
        </div>
      </router-link>
      <router-link v-else key="expand" to="/">
        <div class="flex items-center justify-center h-full">
          <img :src="logo" class="layout-logo-text w-40px h-40px mr-10px">
          <span class="text-[#fff] text-20px font-800">大美</span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  text-align: center;
  overflow: hidden;

  .layout-logo {
    display: none;
  }

  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
    border-radius: 50%;
  }
}

.layout-mode-top {
  height: var(--v3-navigationbar-height);
  line-height: var(--v3-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }

  .layout-logo-text {
    display: none;
  }
}
</style>
