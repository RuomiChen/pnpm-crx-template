import { Loading } from '@element-plus/icons-vue'
import { ElIcon, ElMessage, type MessageHandler } from 'element-plus'
import { defineStore } from 'pinia'
import { h, ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const count = ref(0)

  let handler: MessageHandler | null = null

  function begin() {
    if (handler === null || count.value === 0) {
      count.value = 0

      handler = ElMessage.success({
        message: '加载中',
        icon: h(ElIcon, { size: '20px', class: 'is-loading' }, { default: () => h(Loading) }),
        duration: 0,
      })
    }

    count.value++
  }

  function end() {
    count.value--

    if (count.value <= 0) {
      clear()
    }
  }

  function clear() {
    handler?.close()

    handler = null
    count.value = 0
  }

  return {
    count,
    begin,
    end,
    clear,
  }
})
