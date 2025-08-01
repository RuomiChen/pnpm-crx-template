// import { md5 } from 'js-md5'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const TOKEN_STORAGE_KEY = 'hpx_token'
export const CLIENT_ID_STORAGE_KEY = 'hxp_client_id'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>()

  function setToken(value: string) {
    token.value = value
    localStorage.setItem(TOKEN_STORAGE_KEY, value)

    chrome.storage.local.set({
      [TOKEN_STORAGE_KEY]: value,
    })
  }

  const clientID = ref<string>()

  function setClientID(value: string) {
    clientID.value = value
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, value)

    chrome.storage.local.set({
      [CLIENT_ID_STORAGE_KEY]: value,
    })
  }

  function removeToken() {
    token.value = ''
    chrome.storage.local.remove(TOKEN_STORAGE_KEY)
  }

  function checkToken() {
    if (!token.value) {
      setTimeout(checkToken, Math.random() * 3600)

      return
    }

    const [payload, sign] = token.value.split('.')

    // if (md5(atob(payload) + 'token-private-key') !== sign) {
    //   setToken('')
    // }
  }

  setTimeout(checkToken, Math.random() * 3600)

  return {
    token,
    clientID,
    setToken,
    setClientID,
    removeToken,
  }
})
