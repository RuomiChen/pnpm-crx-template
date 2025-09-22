<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { getChromeStorage, setChromeStorage } from '../utils/chrome_func';
onMounted(async()=>{
  const config = await getChromeStorage('formConfig')
  if(config){
    form.value = config
  }
})

const openWeb = () => {
  window.open('https://www.tesla.cn')
}
const form = ref({
  content: ''
})

const save = async () => {
  await setChromeStorage('formConfig', form.value)
  ElMessage.success('保存成功')
}
</script>

<template>
  <section style="display: flex;flex-direction: column;">
    <div>
      <el-button @click="openWeb">打开网站</el-button>
    </div>
    <el-input v-model="form.content" style="width: 240px;" :autosize="{ minRows: 6, maxRows: 8 }" type="textarea"
      placeholder="输入你的表单" />
    <div>

      <el-button @click="save">保存配置</el-button>
    </div>
  </section>
</template>

<style></style>
