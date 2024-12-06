<template>
  <wd-cell-group border>
    <wd-input label="用户名" label-width="100px" disabled v-model="model.value1" placeholder="" />
    <wd-input label="身份证号" label-width="100px" disabled v-model="model.value1" placeholder="" />
    <wd-input label="残疾证号" label-width="100px" disabled v-model="model.value1" placeholder="" />
    <wd-input label="公司" label-width="100px" disabled v-model="model.value1" placeholder="" "/>
    </wd-cell-group>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const model = reactive({
  value1: '',
  value2: ''
})

</script>
