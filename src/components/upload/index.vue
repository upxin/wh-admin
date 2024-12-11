<template>
  <el-upload
    :file-list="fileList"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :http-request="customRequest"
    multiple
    v-bind="$attrs"
  >
    <el-button type="primary">{{ text }}</el-button>
  </el-upload>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {uploadFile} from '@@/apis/common'

const props = defineProps({
  text: '',
  url: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  uploadData: {
    type: Object,
    default: () => ({})
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  maxSize:{
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue'])

const fileList = ref([...props.modelValue])

watch(fileList, (newList) => {
  emit('update:modelValue', newList)
})

const handlePreview = (file) => {
  console.log('Preview file:', file)
}

const handleRemove = (file, fileList) => {
  console.log('Remove file:', file)
  emit('update:modelValue', fileList)
}

const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < props.maxSize
  if (!isLt5M) {
    ElMessage.error('File size cannot exceed 5MB!')
  }
  return isLt5M
}

const handleSuccess = (response, file, fileList) => {
  console.log('File uploaded successfully:', response)
  emit('update:modelValue', fileList)
}

const customRequest = async (options) => {
  const { file, onSuccess, onError } = options
  console.log(file, fileList.value)

  try {
    const response = await uploadFile('/system/disabledUser/importData', fileList.value)
    onSuccess(response)
  } catch (error) {
    onError(error)
  }
}
</script>
